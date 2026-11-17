import { useEffect } from 'react';
import { Redirigir, navegar, useRuta } from './enrutador/enrutador.jsx';
import { useAuth } from './contexto/AuthContext.jsx';
import { ADMINISTRADOR, USUARIO, rutaInicial } from './rutas.js';
import Estructura from './componentes/Estructura.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';
import PaginaLogin from './paginas/PaginaLogin.jsx';
import PaginaPanel from './paginas/PaginaPanel.jsx';
import PaginaDocumentos from './paginas/PaginaDocumentos.jsx';
import PaginaEnConstruccion from './paginas/PaginaEnConstruccion.jsx';
import PaginaNoEncontrada from './paginas/PaginaNoEncontrada.jsx';

// Tabla de pantallas: ruta, título, componente y roles con permiso.
const PANTALLAS = {
  '/panel': { titulo: 'Panel administrativo', Pagina: PaginaPanel, roles: [ADMINISTRADOR] },
  '/documentos': { titulo: 'Gestión de documentos', Pagina: PaginaDocumentos, roles: [ADMINISTRADOR, USUARIO] },
  '/usuarios': {
    titulo: 'Usuarios', roles: [ADMINISTRADOR],
    Pagina: () => <PaginaEnConstruccion modulo="usuarios" prototipo="/usuarios.html" />
  },
  '/reportes': {
    titulo: 'Reportes', roles: [ADMINISTRADOR],
    Pagina: () => <PaginaEnConstruccion modulo="reportes" prototipo="/reportes.html" />
  },
  '/perfil': {
    titulo: 'Perfil', roles: [ADMINISTRADOR, USUARIO],
    Pagina: () => <PaginaEnConstruccion modulo="perfil" prototipo="/perfil.html" />
  }
};

// Componente raíz: decide qué pantalla mostrar según la ruta y la sesión.
export default function App() {
  const ruta = useRuta();
  const { usuario } = useAuth();

  // La raíz (#/ o sin hash) lleva al login o a la pantalla inicial del rol
  useEffect(() => {
    if (ruta === '/') {
      navegar(usuario ? rutaInicial(usuario.rol) : '/login', { reemplazar: true });
    }
  }, [ruta, usuario]);

  if (ruta === '/') {
    return null;
  }
  if (ruta === '/login') {
    return usuario ? <Redirigir a={rutaInicial(usuario.rol)} /> : <PaginaLogin />;
  }

  const pantalla = PANTALLAS[ruta];
  if (!pantalla) {
    return usuario
      ? <Estructura titulo="No encontrada"><PaginaNoEncontrada /></Estructura>
      : <Redirigir a="/login" />;
  }

  const { titulo, Pagina, roles } = pantalla;
  return (
    <RutaProtegida roles={roles}>
      <Estructura titulo={titulo}><Pagina /></Estructura>
    </RutaProtegida>
  );
}
