package co.edu.sena.infomanager.dto;

/** Totales que muestra el panel administrativo. Por vencer y vencidos cuentan solo documentos activos. */
public record ResumenDocumentos(long total, long activos, long archivados, long porVencer, long vencidos) {
}
