package co.edu.sena.infomanager.dto;

import co.edu.sena.infomanager.modelo.EstadoDocumento;

import java.time.LocalDate;

/** Datos que se pueden modificar de un documento ya subido (el archivo no se reemplaza). */
public record DocumentoActualizacion(
        String titulo,
        String descripcion,
        Integer idCategoria,
        LocalDate fechaVencimiento,
        EstadoDocumento estado) {
}
