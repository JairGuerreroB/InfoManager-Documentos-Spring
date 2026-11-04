package co.edu.sena.infomanager.dto;

import org.springframework.core.io.Resource;

/** Archivo listo para descargar junto con el nombre con el que se ofrece al usuario. */
public record ArchivoDescarga(Resource recurso, String nombreSugerido) {
}
