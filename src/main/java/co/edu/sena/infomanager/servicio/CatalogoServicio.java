package co.edu.sena.infomanager.servicio;

import co.edu.sena.infomanager.dto.CatalogoItem;
import co.edu.sena.infomanager.repositorio.CategoriaRepositorio;
import co.edu.sena.infomanager.repositorio.UsuarioRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Listas para los campos desplegables de la pantalla de documentos. */
@Service
public class CatalogoServicio {

    private final CategoriaRepositorio categorias;
    private final UsuarioRepositorio usuarios;

    public CatalogoServicio(CategoriaRepositorio categorias, UsuarioRepositorio usuarios) {
        this.categorias = categorias;
        this.usuarios = usuarios;
    }

    @Transactional(readOnly = true)
    public List<CatalogoItem> listarCategorias() {
        return categorias.findAllByOrderByNombreAsc().stream()
                .map(categoria -> new CatalogoItem(categoria.getIdCategoria(), categoria.getNombre()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogoItem> listarUsuarios() {
        return usuarios.findAllByOrderByNombreAscApellidoAsc().stream()
                .map(usuario -> new CatalogoItem(usuario.getIdUsuario(), usuario.getNombreCompleto()))
                .toList();
    }
}
