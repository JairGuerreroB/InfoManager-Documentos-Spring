package co.edu.sena.infomanager.modelo;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Estado administrativo de un documento. Equivale a la columna ENUM('activo','archivado')
 * de la tabla documentos.
 */
public enum EstadoDocumento {
    ACTIVO("activo"),
    ARCHIVADO("archivado");

    private final String valor;

    EstadoDocumento(String valor) {
        this.valor = valor;
    }

    /** Texto usado en la base de datos y en el JSON de la API. */
    @JsonValue
    public String getValor() {
        return valor;
    }

    /** Convierte el texto recibido (sin importar mayúsculas) en el estado correspondiente. */
    @JsonCreator
    public static EstadoDocumento desdeValor(String valor) {
        for (EstadoDocumento estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de documento no válido: " + valor);
    }
}
