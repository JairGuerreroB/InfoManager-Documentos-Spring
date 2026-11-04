package co.edu.sena.infomanager.modelo;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Le indica a Hibernate cómo guardar y leer el estado: en la base de datos se almacena en
 * minúsculas ('activo'), mientras que en Java es una constante del enumerado (ACTIVO).
 */
@Converter
public class EstadoDocumentoConverter implements AttributeConverter<EstadoDocumento, String> {

    @Override
    public String convertToDatabaseColumn(EstadoDocumento estado) {
        return estado == null ? null : estado.getValor();
    }

    @Override
    public EstadoDocumento convertToEntityAttribute(String valor) {
        return valor == null ? null : EstadoDocumento.desdeValor(valor);
    }
}
