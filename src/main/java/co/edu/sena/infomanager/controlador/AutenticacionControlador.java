package co.edu.sena.infomanager.controlador;

import co.edu.sena.infomanager.dto.LoginSolicitud;
import co.edu.sena.infomanager.dto.SesionRespuesta;
import co.edu.sena.infomanager.servicio.AutenticacionServicio;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API de autenticación.
 *
 * POST /api/auth/login  recibe {correo, contrasena} y devuelve los datos del usuario y su rol.
 *
 * Nota: por ahora la API no entrega un token; la pantalla recuerda al usuario durante la sesión del navegador.
 * La protección real de cada ruta del servidor llegará con Spring Security.
 */
@RestController
@RequestMapping("/api/auth")
public class AutenticacionControlador {

    private final AutenticacionServicio servicio;

    public AutenticacionControlador(AutenticacionServicio servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    public SesionRespuesta iniciarSesion(@RequestBody LoginSolicitud solicitud) {
        return servicio.autenticar(solicitud);
    }
}
