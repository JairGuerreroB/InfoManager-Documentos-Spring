package co.edu.sena.infomanager.repositorio;

import co.edu.sena.infomanager.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Consulta de usuarios (solo lectura) para saber quién sube cada documento. */
public interface UsuarioRepositorio extends JpaRepository<Usuario, Integer> {

    /** Usuarios ordenados por nombre y apellido. */
    List<Usuario> findAllByOrderByNombreAscApellidoAsc();
}
