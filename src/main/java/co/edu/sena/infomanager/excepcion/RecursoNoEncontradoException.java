package co.edu.sena.infomanager.excepcion;

/** El documento o archivo solicitado no existe. */
public class RecursoNoEncontradoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
