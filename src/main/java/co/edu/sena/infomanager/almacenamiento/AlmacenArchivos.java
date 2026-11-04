package co.edu.sena.infomanager.almacenamiento;

import co.edu.sena.infomanager.excepcion.AlmacenamientoException;
import co.edu.sena.infomanager.excepcion.RecursoNoEncontradoException;
import co.edu.sena.infomanager.excepcion.ValidacionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

/**
 * Guarda los archivos subidos en una carpeta del disco. Cada archivo se almacena con un nombre
 * aleatorio (UUID): así no se pisan archivos con el mismo nombre y nadie puede escribir fuera
 * de la carpeta usando un nombre malicioso como "../../algo".
 */
@Component
public class AlmacenArchivos {

    private static final Logger LOGGER = LoggerFactory.getLogger(AlmacenArchivos.class);

    private static final Set<String> EXTENSIONES_PERMITIDAS =
            Set.of("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg");

    private final Path raiz;

    /** La carpeta se toma de la propiedad infomanager.almacen.ruta y se crea si no existe. */
    public AlmacenArchivos(@Value("${infomanager.almacen.ruta:./almacen}") String ruta) {
        this.raiz = Paths.get(ruta).toAbsolutePath().normalize();
        try {
            Files.createDirectories(raiz);
        } catch (IOException e) {
            throw new AlmacenamientoException("No se pudo crear la carpeta de archivos: " + raiz, e);
        }
    }

    /**
     * Valida y guarda el archivo recibido.
     *
     * @return el nombre con el que quedó guardado (se registra en la columna ruta_archivo)
     */
    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ValidacionException("Debe seleccionar un archivo.");
        }
        String extension = extensionDe(archivo.getOriginalFilename());
        if (!EXTENSIONES_PERMITIDAS.contains(extension)) {
            throw new ValidacionException("Tipo de archivo no permitido. Use pdf, doc, docx, xls, "
                    + "xlsx, ppt, pptx, txt, png, jpg o jpeg.");
        }
        String nombreAlmacenado = UUID.randomUUID() + "." + extension;
        try (InputStream entrada = archivo.getInputStream()) {
            Files.copy(entrada, resolver(nombreAlmacenado), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new AlmacenamientoException("No fue posible guardar el archivo.", e);
        }
        return nombreAlmacenado;
    }

    /** Devuelve el archivo guardado para poder descargarlo. */
    public Resource cargar(String nombreAlmacenado) {
        Resource recurso = new FileSystemResource(resolver(nombreAlmacenado));
        if (recurso.exists() && recurso.isReadable()) {
            return recurso;
        }
        throw new RecursoNoEncontradoException("El archivo del documento no se encuentra en el almacén.");
    }

    /** Elimina el archivo del disco; si no se puede, solo lo registra porque no debe frenar al usuario. */
    public void borrar(String nombreAlmacenado) {
        try {
            Files.deleteIfExists(resolver(nombreAlmacenado));
        } catch (IOException e) {
            LOGGER.warn("No se pudo eliminar el archivo {}", nombreAlmacenado, e);
        }
    }

    /** Extensión en minúsculas, sin el punto; cadena vacía si el nombre no tiene extensión. */
    public static String extensionDe(String nombre) {
        if (nombre == null) {
            return "";
        }
        int punto = nombre.lastIndexOf('.');
        return punto < 0 ? "" : nombre.substring(punto + 1).toLowerCase();
    }

    /** Ubica el archivo dentro de la carpeta del almacén, rechazando rutas que se salgan de ella. */
    private Path resolver(String nombre) {
        Path destino = raiz.resolve(nombre).normalize();
        if (!destino.startsWith(raiz)) {
            throw new ValidacionException("Nombre de archivo no válido.");
        }
        return destino;
    }
}
