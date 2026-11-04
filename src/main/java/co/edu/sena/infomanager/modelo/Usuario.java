package co.edu.sena.infomanager.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

/**
 * Vista de solo lectura de la tabla usuarios. Este módulo únicamente necesita saber quién subió
 * cada documento; la gestión completa de usuarios se hizo en las evidencias anteriores.
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
}
