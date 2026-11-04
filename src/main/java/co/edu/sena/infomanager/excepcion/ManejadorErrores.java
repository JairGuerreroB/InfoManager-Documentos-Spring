package co.edu.sena.infomanager.excepcion;

import co.edu.sena.infomanager.dto.ErrorRespuesta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

/**
 * Convierte las excepciones del módulo en respuestas HTTP con un mensaje claro, en lugar de
 * mostrar errores técnicos. Aplica a todos los controladores.
 */
@RestControllerAdvice
public class ManejadorErrores {

    private static final Logger LOGGER = LoggerFactory.getLogger(ManejadorErrores.class);

    @ExceptionHandler(ValidacionException.class)
    public ResponseEntity<ErrorRespuesta> alValidar(ValidacionException e) {
        return responder(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    /** JSON mal formado, estado inexistente, fecha o número con formato incorrecto. */
    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorRespuesta> alRecibirDatosInvalidos(Exception e) {
        return responder(HttpStatus.BAD_REQUEST,
                "Los datos enviados no son válidos. Revise los campos e inténtelo de nuevo.");
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorRespuesta> alNoEncontrar(RecursoNoEncontradoException e) {
        return responder(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorRespuesta> alExcederTamano(MaxUploadSizeExceededException e) {
        return responder(HttpStatus.PAYLOAD_TOO_LARGE, "El archivo supera el tamaño máximo permitido (10 MB).");
    }

    @ExceptionHandler(AlmacenamientoException.class)
    public ResponseEntity<ErrorRespuesta> alFallarElAlmacen(AlmacenamientoException e) {
        LOGGER.error("Error de almacenamiento de archivos", e);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    private ResponseEntity<ErrorRespuesta> responder(HttpStatus estado, String mensaje) {
        return ResponseEntity.status(estado).body(new ErrorRespuesta(mensaje));
    }
}
