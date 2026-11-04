package co.edu.sena.infomanager.excepcion;

/** Falló la lectura o escritura de un archivo en el disco. */
public class AlmacenamientoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AlmacenamientoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
