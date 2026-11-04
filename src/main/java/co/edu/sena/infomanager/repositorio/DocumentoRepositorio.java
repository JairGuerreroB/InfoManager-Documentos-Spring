package co.edu.sena.infomanager.repositorio;

import co.edu.sena.infomanager.modelo.Documento;
import co.edu.sena.infomanager.modelo.EstadoDocumento;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Acceso a la tabla documentos. Spring Data genera la implementación: los métodos heredados
 * (save, findById, delete, count...) funcionan sin escribir código, y aquí se agregan solo
 * las consultas propias del módulo.
 */
public interface DocumentoRepositorio extends JpaRepository<Documento, Integer> {

    /**
     * Busca documentos por parte del título y, opcionalmente, por categoría.
     * Un texto vacío trae todos; un idCategoria igual a 0 significa "todas las categorías".
     * El EntityGraph carga categoría y usuario en la misma consulta (evita una consulta por fila).
     */
    @Query("""
            select d from Documento d
            where lower(d.titulo) like lower(concat('%', :texto, '%'))
              and (:idCategoria = 0 or d.categoria.idCategoria = :idCategoria)
            order by d.fechaSubida desc
            """)
    @EntityGraph(attributePaths = {"categoria", "usuario"})
    List<Documento> buscar(@Param("texto") String texto, @Param("idCategoria") int idCategoria);

    /** Cuenta los documentos que tienen un estado determinado. */
    long countByEstado(EstadoDocumento estado);

    /** Fechas de vencimiento de los documentos de un estado (se usa para el resumen del panel). */
    @Query("select d.fechaVencimiento from Documento d "
            + "where d.estado = :estado and d.fechaVencimiento is not null")
    List<LocalDate> fechasVencimientoPorEstado(@Param("estado") EstadoDocumento estado);
}
