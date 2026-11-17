package co.edu.sena.infomanager.servicio;

import co.edu.sena.infomanager.dto.LoginSolicitud;
import co.edu.sena.infomanager.dto.SesionRespuesta;
import co.edu.sena.infomanager.excepcion.CredencialesInvalidasException;
import co.edu.sena.infomanager.excepcion.ValidacionException;
import co.edu.sena.infomanager.modelo.Rol;
import co.edu.sena.infomanager.modelo.Usuario;
import co.edu.sena.infomanager.repositorio.UsuarioRepositorio;
import co.edu.sena.infomanager.util.ContrasenaUtil;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Pruebas del inicio de sesión. No necesitan base de datos: el repositorio se reemplaza por uno en memoria.
 */
class AutenticacionServicioTest {

    private static final String CLAVE = "Clave1234*";

    private final Map<String, Usuario> baseDeDatos = new HashMap<>();
    private final AutenticacionServicio servicio;

    AutenticacionServicioTest() throws Exception {
        baseDeDatos.put("ana@x.com", crearUsuario("ana@x.com", "activo", "Administrador"));
        baseDeDatos.put("inactivo@x.com", crearUsuario("inactivo@x.com", "inactivo", "Usuario"));
        servicio = new AutenticacionServicio(repositorioEnMemoria());
    }

    @Test
    void credencialesCorrectasDevuelvenElUsuarioYSuRol() {
        SesionRespuesta sesion = servicio.autenticar(new LoginSolicitud("  ANA@x.com ", CLAVE));

        assertEquals("ana@x.com", sesion.correo());
        assertEquals("Administrador", sesion.rol());
        assertEquals("Ana", sesion.nombre());
    }

    @Test
    void contrasenaIncorrectaSeRechaza() {
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new LoginSolicitud("ana@x.com", "otra-clave")));
    }

    @Test
    void correoInexistenteSeRechazaConElMismoMensaje() {
        CredencialesInvalidasException fallo = assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new LoginSolicitud("nadie@x.com", CLAVE)));
        CredencialesInvalidasException otro = assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new LoginSolicitud("ana@x.com", "mala")));

        // El mensaje no debe revelar si el correo existe
        assertEquals(otro.getMessage(), fallo.getMessage());
    }

    @Test
    void usuarioInactivoNoPuedeIniciarSesion() {
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new LoginSolicitud("inactivo@x.com", CLAVE)));
    }

    @Test
    void faltanDatosEsUnErrorDeValidacion() {
        assertThrows(ValidacionException.class, () -> servicio.autenticar(null));
        assertThrows(ValidacionException.class, () -> servicio.autenticar(new LoginSolicitud("", CLAVE)));
        assertThrows(ValidacionException.class, () -> servicio.autenticar(new LoginSolicitud("ana@x.com", "")));
    }

    // ------------------------------------------------------------------
    // Apoyo: las entidades no tienen setters, así que se llenan por reflexión
    // ------------------------------------------------------------------

    private static void poner(Object objeto, String campo, Object valor) throws Exception {
        Field atributo = objeto.getClass().getDeclaredField(campo);
        atributo.setAccessible(true);
        atributo.set(objeto, valor);
    }

    private static Usuario crearUsuario(String correo, String estado, String nombreRol) throws Exception {
        Rol rol = new Rol();
        poner(rol, "idRol", 1);
        poner(rol, "nombreRol", nombreRol);

        Usuario usuario = new Usuario();
        poner(usuario, "idUsuario", 7);
        poner(usuario, "nombre", "Ana");
        poner(usuario, "apellido", "Pérez");
        poner(usuario, "correo", correo);
        poner(usuario, "contrasena", ContrasenaUtil.generarHash(CLAVE));
        poner(usuario, "estado", estado);
        poner(usuario, "rol", rol);
        return usuario;
    }

    /** Repositorio falso: solo responde a la búsqueda por correo, que es lo único que usa el servicio. */
    private UsuarioRepositorio repositorioEnMemoria() {
        return (UsuarioRepositorio) Proxy.newProxyInstance(
                UsuarioRepositorio.class.getClassLoader(),
                new Class<?>[]{UsuarioRepositorio.class},
                (proxy, metodo, argumentos) -> "findByCorreoIgnoreCase".equals(metodo.getName())
                        ? Optional.ofNullable(baseDeDatos.get(((String) argumentos[0]).toLowerCase()))
                        : null);
    }
}
