package co.edu.sena.infomanager.excepcion;

/** El correo o la contraseña no son correctos, o el usuario está inactivo. Se responde con HTTP 401. */
public class CredencialesInvalidasException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
