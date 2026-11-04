package co.edu.sena.infomanager.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

/**
 * Categoría con la que se clasifica un documento (Contratos, Informes, ...).
 * En este módulo solo se consulta; las categorías se cargan con el script 03.
 */
@Entity
@Immutable
@Table(name = "categorias_documento")
public class CategoriaDocumento {

    @Id
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(name = "nombre_categoria", nullable = false, length = 50)
    private String nombre;

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public String getNombre() {
        return nombre;
    }
}
