package co.edu.sena.infomanager.repositorio;

import co.edu.sena.infomanager.modelo.CategoriaDocumento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** Consulta de las categorías de documento. */
public interface CategoriaRepositorio extends JpaRepository<CategoriaDocumento, Integer> {

    /** Categorías ordenadas alfabéticamente por nombre. */
    List<CategoriaDocumento> findAllByOrderByNombreAsc();
}
