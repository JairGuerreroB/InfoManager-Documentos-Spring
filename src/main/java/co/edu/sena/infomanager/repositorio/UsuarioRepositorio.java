package co.edu.sena.infomanager.repositorio;

import co.edu.sena.infomanager.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/** Consulta de usuarios (solo lectura): lista para desplegables y búsqueda por correo para el inicio de sesión. */
public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    /** Usuarios ordenados por nombre y apellido. */
    List<Usuario> findAllByOrderByNombreAscApellidoAsc();

    /** Busca un usuario por su correo sin distinguir mayúsculas de minúsculas. */
    Optional<Usuario> findByCorreoIgnoreCase(String correo);
}
