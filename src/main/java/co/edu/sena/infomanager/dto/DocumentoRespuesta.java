package co.edu.sena.infomanager.dto;

import co.edu.sena.infomanager.almacenamiento.AlmacenArchivos;
import co.edu.sena.infomanager.modelo.Documento;
import co.edu.sena.infomanager.modelo.EstadoDocumento;
import co.edu.sena.infomanager.modelo.Vigencia;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Datos de un documento tal como los recibe la pantalla. Se usa un objeto aparte de la entidad
 * para no exponer la ruta interna del archivo y para incluir los datos calculados (vigencia).
 */
public record DocumentoRespuesta(
        Integer idDocumento,
        String titulo,
        String descripcion,
        Integer idCategoria,
        String categoria,
        Integer idUsuario,
        String subidoPor,
        String extension,
        LocalDateTime fechaSubida,
        LocalDate fechaVencimiento,
        Long diasParaVencer,
        Vigencia vigencia,
        EstadoDocumento estado) {

    /** Convierte una entidad en la respuesta, calculando la vigencia respecto a la fecha dada. */
    public static DocumentoRespuesta desde(Documento documento, LocalDate hoy, int diasAviso) {
        LocalDate vencimiento = documento.getFechaVencimiento();
        return new DocumentoRespuesta(
                documento.getIdDocumento(),
                documento.getTitulo(),
                documento.getDescripcion(),
                documento.getCategoria().getIdCategoria(),
                documento.getCategoria().getNombre(),
                documento.getUsuario().getIdUsuario(),
                documento.getUsuario().getNombreCompleto(),
                AlmacenArchivos.extensionDe(documento.getRutaArchivo()),
                documento.getFechaSubida(),
                vencimiento,
                Vigencia.diasRestantes(vencimiento, hoy),
                Vigencia.calcular(vencimiento, hoy, diasAviso),
                documento.getEstado());
    }
}
