package co.edu.sena.infomanager.dto;

/** Datos del usuario autenticado que recibe la pantalla. No incluye la contraseña ni su hash. */
public record SesionRespuesta(Integer idUsuario, String nombre, String apellido, String correo, String rol) {
}
