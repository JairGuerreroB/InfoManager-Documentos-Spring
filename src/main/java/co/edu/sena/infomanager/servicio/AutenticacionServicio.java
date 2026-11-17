package co.edu.sena.infomanager.servicio;

import co.edu.sena.infomanager.dto.LoginSolicitud;
import co.edu.sena.infomanager.dto.SesionRespuesta;
import co.edu.sena.infomanager.excepcion.CredencialesInvalidasException;
import co.edu.sena.infomanager.excepcion.ValidacionException;
import co.edu.sena.infomanager.modelo.Usuario;
import co.edu.sena.infomanager.repositorio.UsuarioRepositorio;
import co.edu.sena.infomanager.util.ContrasenaUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Inicio de sesión: comprueba el correo y la contraseña contra la tabla usuarios. Las contraseñas se guardan con
 * PBKDF2 (ContrasenaUtil), igual que en los módulos de usuarios de las evidencias anteriores.
 */
@Service
public class AutenticacionServicio {

    /** Mismo mensaje para cualquier fallo, para no revelar si el correo existe. */
    private static final String MENSAJE_FALLO = "Correo o contraseña incorrectos, o el usuario está inactivo.";

    /**
     * Hash de una contraseña inventada. Se verifica siempre una contraseña, exista o no el correo, para que el
     * tiempo de respuesta no permita adivinar qué correos están registrados.
     */
    private static final String HASH_FICTICIO = ContrasenaUtil.generarHash("contrasena-que-no-existe");

    private final UsuarioRepositorio usuarios;

    public AutenticacionServicio(UsuarioRepositorio usuarios) {
        this.usuarios = usuarios;
    }

    /**
     * Valida las credenciales y devuelve los datos del usuario.
     *
     * @throws ValidacionException           si falta el correo o la contraseña
     * @throws CredencialesInvalidasException si las credenciales no son correctas o el usuario está inactivo
     */
    @Transactional(readOnly = true)
    public SesionRespuesta autenticar(LoginSolicitud solicitud) {
        if (solicitud == null || solicitud.correo() == null || solicitud.correo().isBlank()
                || solicitud.contrasena() == null || solicitud.contrasena().isEmpty()) {
            throw new ValidacionException("Ingrese el correo y la contraseña.");
        }

        Usuario usuario = usuarios.findByCorreoIgnoreCase(solicitud.correo().trim()).orElse(null);
        String hash = (usuario != null) ? usuario.getContrasena() : HASH_FICTICIO;
        boolean coincide = ContrasenaUtil.verificar(solicitud.contrasena(), hash);

        if (usuario == null || !coincide || !usuario.estaActivo()) {
            throw new CredencialesInvalidasException(MENSAJE_FALLO);
        }
        return new SesionRespuesta(usuario.getIdUsuario(), usuario.getNombre(), usuario.getApellido(),
                usuario.getCorreo(), usuario.getRol().getNombreRol());
    }
}
