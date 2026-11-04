package co.edu.sena.infomanager.servicio;

import co.edu.sena.infomanager.almacenamiento.AlmacenArchivos;
import co.edu.sena.infomanager.dto.ArchivoDescarga;
import co.edu.sena.infomanager.dto.DocumentoActualizacion;
import co.edu.sena.infomanager.dto.DocumentoRespuesta;
import co.edu.sena.infomanager.dto.ResumenDocumentos;
import co.edu.sena.infomanager.excepcion.RecursoNoEncontradoException;
import co.edu.sena.infomanager.excepcion.ValidacionException;
import co.edu.sena.infomanager.modelo.CategoriaDocumento;
import co.edu.sena.infomanager.modelo.Documento;
import co.edu.sena.infomanager.modelo.EstadoDocumento;
import co.edu.sena.infomanager.modelo.Usuario;
import co.edu.sena.infomanager.modelo.Vigencia;
import co.edu.sena.infomanager.repositorio.CategoriaRepositorio;
import co.edu.sena.infomanager.repositorio.DocumentoRepositorio;
import co.edu.sena.infomanager.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * Reglas del módulo de documentos: valida los datos, coordina la base de datos (repositorios)
 * con el almacén de archivos y calcula la vigencia. Los métodos marcados con @Transactional se
 * ejecutan dentro de una transacción: si algo falla, los cambios en la base se deshacen.
 */
@Service
public class DocumentoServicio {

    private static final int MAXIMO_TITULO = 100;
    private static final int MAXIMO_DESCRIPCION = 255;

    private final DocumentoRepositorio documentos;
    private final CategoriaRepositorio categorias;
    private final UsuarioRepositorio usuarios;
    private final AlmacenArchivos almacen;
    private final int diasAviso;

    /** Spring entrega las dependencias por el constructor (inyección de dependencias). */
    public DocumentoServicio(DocumentoRepositorio documentos,
                             CategoriaRepositorio categorias,
                             UsuarioRepositorio usuarios,
                             AlmacenArchivos almacen,
                             @Value("${infomanager.dias-aviso-vencimiento:30}") int diasAviso) {
        this.documentos = documentos;
        this.categorias = categorias;
        this.usuarios = usuarios;
        this.almacen = almacen;
        this.diasAviso = diasAviso;
    }

    /** Lista documentos filtrando por texto del título, categoría y vigencia (todos opcionales). */
    @Transactional(readOnly = true)
    public List<DocumentoRespuesta> listar(String texto, Integer idCategoria, String vigencia) {
        String filtroTexto = texto == null ? "" : texto.trim();
        int filtroCategoria = idCategoria == null ? 0 : idCategoria;
        Vigencia filtroVigencia = (vigencia == null || vigencia.isBlank()) ? null : Vigencia.desdeValor(vigencia);
        LocalDate hoy = LocalDate.now();

        return documentos.buscar(filtroTexto, filtroCategoria).stream()
                .map(documento -> DocumentoRespuesta.desde(documento, hoy, diasAviso))
                .filter(respuesta -> filtroVigencia == null || respuesta.vigencia() == filtroVigencia)
                .toList();
    }

    /** Consulta un documento por su identificador. */
    @Transactional(readOnly = true)
    public DocumentoRespuesta obtener(Integer id) {
        return DocumentoRespuesta.desde(buscarDocumento(id), LocalDate.now(), diasAviso);
    }

    /** Registra un documento nuevo y guarda su archivo. */
    @Transactional
    public DocumentoRespuesta crear(String titulo, String descripcion, Integer idCategoria,
                                    Integer idUsuario, LocalDate fechaVencimiento, MultipartFile archivo) {
        validarTextos(titulo, descripcion);
        CategoriaDocumento categoria = buscarCategoria(idCategoria);
        Usuario usuario = buscarUsuario(idUsuario);

        String rutaArchivo = almacen.guardar(archivo);
        try {
            Documento documento = new Documento();
            documento.setTitulo(titulo.trim());
            documento.setDescripcion(normalizarDescripcion(descripcion));
            documento.setCategoria(categoria);
            documento.setUsuario(usuario);
            documento.setRutaArchivo(rutaArchivo);
            documento.setFechaVencimiento(fechaVencimiento);
            documentos.save(documento);
            return DocumentoRespuesta.desde(documento, LocalDate.now(), diasAviso);
        } catch (RuntimeException e) {
            almacen.borrar(rutaArchivo); // si la base falla, no queda un archivo huérfano
            throw e;
        }
    }

    /** Modifica los datos de un documento (título, descripción, categoría, vencimiento y estado). */
    @Transactional
    public DocumentoRespuesta actualizar(Integer id, DocumentoActualizacion datos) {
        Documento documento = buscarDocumento(id);
        validarTextos(datos.titulo(), datos.descripcion());
        if (datos.estado() == null) {
            throw new ValidacionException("Debe indicar el estado del documento.");
        }
        documento.setTitulo(datos.titulo().trim());
        documento.setDescripcion(normalizarDescripcion(datos.descripcion()));
        documento.setCategoria(buscarCategoria(datos.idCategoria()));
        documento.setFechaVencimiento(datos.fechaVencimiento());
        documento.setEstado(datos.estado());
        documentos.save(documento);
        return DocumentoRespuesta.desde(documento, LocalDate.now(), diasAviso);
    }

    /** Elimina el documento y su archivo. */
    @Transactional
    public void eliminar(Integer id) {
        Documento documento = buscarDocumento(id);
        String rutaArchivo = documento.getRutaArchivo();
        documentos.delete(documento);
        documentos.flush(); // asegura el DELETE en la base antes de borrar el archivo del disco
        almacen.borrar(rutaArchivo);
    }

    /** Prepara el archivo de un documento para descargarlo con un nombre legible. */
    @Transactional(readOnly = true)
    public ArchivoDescarga descargar(Integer id) {
        Documento documento = buscarDocumento(id);
        String extension = AlmacenArchivos.extensionDe(documento.getRutaArchivo());
        String nombreLimpio = documento.getTitulo().replaceAll("[\\\\/:*?\"<>|\\r\\n]", "_");
        return new ArchivoDescarga(almacen.cargar(documento.getRutaArchivo()), nombreLimpio + "." + extension);
    }

    /** Totales para el panel administrativo. */
    @Transactional(readOnly = true)
    public ResumenDocumentos resumen() {
        LocalDate hoy = LocalDate.now();
        List<LocalDate> vencimientos = documentos.fechasVencimientoPorEstado(EstadoDocumento.ACTIVO);
        long porVencer = vencimientos.stream()
                .filter(fecha -> Vigencia.calcular(fecha, hoy, diasAviso) == Vigencia.POR_VENCER).count();
        long vencidos = vencimientos.stream()
                .filter(fecha -> Vigencia.calcular(fecha, hoy, diasAviso) == Vigencia.VENCIDO).count();
        return new ResumenDocumentos(
                documentos.count(),
                documentos.countByEstado(EstadoDocumento.ACTIVO),
                documentos.countByEstado(EstadoDocumento.ARCHIVADO),
                porVencer,
                vencidos);
    }

    // ------------------------------------------------------------------
    // Métodos de apoyo
    // ------------------------------------------------------------------

    private Documento buscarDocumento(Integer id) {
        return documentos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("El documento solicitado no existe."));
    }

    private CategoriaDocumento buscarCategoria(Integer idCategoria) {
        if (idCategoria == null) {
            throw new ValidacionException("Debe seleccionar una categoría.");
        }
        return categorias.findById(idCategoria)
                .orElseThrow(() -> new ValidacionException("La categoría seleccionada no existe."));
    }

    private Usuario buscarUsuario(Integer idUsuario) {
        if (idUsuario == null) {
            throw new ValidacionException("Debe indicar quién sube el documento.");
        }
        return usuarios.findById(idUsuario)
                .orElseThrow(() -> new ValidacionException("El usuario seleccionado no existe."));
    }

    private void validarTextos(String titulo, String descripcion) {
        if (titulo == null || titulo.isBlank()) {
            throw new ValidacionException("El título es obligatorio.");
        }
        if (titulo.trim().length() > MAXIMO_TITULO) {
            throw new ValidacionException("El título no puede superar los " + MAXIMO_TITULO + " caracteres.");
        }
        if (descripcion != null && descripcion.trim().length() > MAXIMO_DESCRIPCION) {
            throw new ValidacionException("La descripción no puede superar los " + MAXIMO_DESCRIPCION + " caracteres.");
        }
    }

    /** Una descripción vacía se guarda como NULL en la base. */
    private String normalizarDescripcion(String descripcion) {
        return (descripcion == null || descripcion.isBlank()) ? null : descripcion.trim();
    }
}
