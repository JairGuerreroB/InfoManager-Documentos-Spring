package co.edu.sena.infomanager.excepcion;

/** Los datos enviados no cumplen una regla del módulo (campo vacío, valor inexistente, etc.). */
public class ValidacionException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ValidacionException(String mensaje) {
        super(mensaje);
    }
}
