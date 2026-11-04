package co.edu.sena.infomanager.controlador;

import co.edu.sena.infomanager.dto.CatalogoItem;
import co.edu.sena.infomanager.servicio.CatalogoServicio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Listas de categorías y usuarios que la pantalla de documentos usa en sus campos desplegables. */
@RestController
@RequestMapping("/api")
public class CatalogoControlador {

    private final CatalogoServicio servicio;

    public CatalogoControlador(CatalogoServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/categorias")
    public List<CatalogoItem> categorias() {
        return servicio.listarCategorias();
    }

    @GetMapping("/usuarios")
    public List<CatalogoItem> usuarios() {
        return servicio.listarUsuarios();
    }
}
