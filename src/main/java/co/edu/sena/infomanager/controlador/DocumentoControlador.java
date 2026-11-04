package co.edu.sena.infomanager.controlador;

import co.edu.sena.infomanager.dto.ArchivoDescarga;
import co.edu.sena.infomanager.dto.DocumentoActualizacion;
import co.edu.sena.infomanager.dto.DocumentoRespuesta;
import co.edu.sena.infomanager.dto.ResumenDocumentos;
import co.edu.sena.infomanager.servicio.DocumentoServicio;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/**
 * API REST de documentos. El controlador solo recibe la petición HTTP y la entrega al servicio;
 * las reglas de negocio viven en DocumentoServicio.
 *
 * GET    /api/documentos              lista (filtros: texto, idCategoria, vigencia)
 * GET    /api/documentos/resumen      totales para el panel
 * GET    /api/documentos/{id}         consulta uno
 * POST   /api/documentos              sube un documento (multipart/form-data)
 * PUT    /api/documentos/{id}         modifica sus datos
 * DELETE /api/documentos/{id}         elimina
 * GET    /api/documentos/{id}/archivo descarga el archivo
 */
@RestController
@RequestMapping("/api/documentos")
public class DocumentoControlador {

    private final DocumentoServicio servicio;

    public DocumentoControlador(DocumentoServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<DocumentoRespuesta> listar(
            @RequestParam(name = "texto", required = false) String texto,
            @RequestParam(name = "idCategoria", required = false) Integer idCategoria,
            @RequestParam(name = "vigencia", required = false) String vigencia) {
        return servicio.listar(texto, idCategoria, vigencia);
    }

    @GetMapping("/resumen")
    public ResumenDocumentos resumen() {
        return servicio.resumen();
    }

    @GetMapping("/{id}")
    public DocumentoRespuesta obtener(@PathVariable("id") Integer id) {
        return servicio.obtener(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoRespuesta> crear(
            @RequestParam(name = "titulo", required = false) String titulo,
            @RequestParam(name = "descripcion", required = false) String descripcion,
            @RequestParam(name = "idCategoria", required = false) Integer idCategoria,
            @RequestParam(name = "idUsuario", required = false) Integer idUsuario,
            @RequestParam(name = "fechaVencimiento", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaVencimiento,
            @RequestParam(name = "archivo", required = false) MultipartFile archivo) {
        DocumentoRespuesta creado = servicio.crear(titulo, descripcion, idCategoria, idUsuario,
                fechaVencimiento, archivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public DocumentoRespuesta actualizar(@PathVariable("id") Integer id,
                                         @RequestBody DocumentoActualizacion datos) {
        return servicio.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargar(@PathVariable("id") Integer id) {
        ArchivoDescarga archivo = servicio.descargar(id);
        ContentDisposition disposicion = ContentDisposition.attachment()
                .filename(archivo.nombreSugerido(), StandardCharsets.UTF_8)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposicion.toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(archivo.recurso());
    }
}
