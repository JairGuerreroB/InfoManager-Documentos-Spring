package co.edu.sena.infomanager.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

/**
 * Vista de solo lectura de la tabla usuarios. Este módulo necesita saber quién subió cada documento y
 * comprobar las credenciales al iniciar sesión; la gestión completa de usuarios se hizo en evidencias anteriores.
 * Solo se mapean las columnas necesarias: Hibernate ignora las demás.
 */
@Entity
@Immutable
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    /** Hash PBKDF2 de la contraseña (nunca el texto plano). No debe salir en ninguna respuesta de la API. */
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;

    /** Valor de la columna ENUM('activo','inactivo'). */
    @Column(name = "estado", nullable = false)
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public Rol getRol() {
        return rol;
    }

    /** Solo los usuarios activos pueden iniciar sesión. */
    public boolean estaActivo() {
        return "activo".equalsIgnoreCase(estado);
    }
}
