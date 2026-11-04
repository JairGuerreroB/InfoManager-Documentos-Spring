package co.edu.sena.infomanager.modelo;

import co.edu.sena.infomanager.excepcion.ValidacionException;
import com.fasterxml.jackson.annotation.JsonValue;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Situación de un documento respecto a su fecha de vencimiento. No se guarda en la base de datos:
 * se calcula cada vez a partir de la fecha de vencimiento, así nunca queda desactualizada.
 */
public enum Vigencia {
    SIN_VENCIMIENTO("sin_vencimiento"),
    VIGENTE("vigente"),
    POR_VENCER("por_vencer"),
    VENCIDO("vencido");

    private final String valor;

    Vigencia(String valor) {
        this.valor = valor;
    }

    /** Texto usado en el JSON de la API y en los filtros de la pantalla. */
    @JsonValue
    public String getValor() {
        return valor;
    }

    /** Convierte el texto de un filtro en la vigencia correspondiente. */
    public static Vigencia desdeValor(String valor) {
        for (Vigencia vigencia : values()) {
            if (vigencia.valor.equalsIgnoreCase(valor)) {
                return vigencia;
            }
        }
        throw new ValidacionException("El filtro de vigencia no es válido.");
    }

    /**
     * Calcula la vigencia de un documento.
     *
     * @param fechaVencimiento fecha en la que vence (puede ser null si no vence)
     * @param hoy              fecha de referencia, normalmente la de hoy
     * @param diasAviso        días de antelación con los que pasa a "por vencer"
     */
    public static Vigencia calcular(LocalDate fechaVencimiento, LocalDate hoy, int diasAviso) {
        if (fechaVencimiento == null) {
            return SIN_VENCIMIENTO;
        }
        if (fechaVencimiento.isBefore(hoy)) {
            return VENCIDO;
        }
        if (!fechaVencimiento.isAfter(hoy.plusDays(diasAviso))) {
            return POR_VENCER;
        }
        return VIGENTE;
    }

    /** Días que faltan para el vencimiento (negativo si ya venció); null si no tiene fecha. */
    public static Long diasRestantes(LocalDate fechaVencimiento, LocalDate hoy) {
        return fechaVencimiento == null ? null : ChronoUnit.DAYS.between(hoy, fechaVencimiento);
    }
}
