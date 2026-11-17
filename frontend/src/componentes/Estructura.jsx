import { useEffect, useState } from 'react';
import { Enlace, navegar, useRuta } from '../enrutador/enrutador.jsx';
import { useAuth } from '../contexto/AuthContext.jsx';
import { useTema } from '../ganchos/useTema.js';
import { MENU } from '../rutas.js';

// Iniciales para el avatar: "Ana Martínez" -> "AM"
function iniciales(usuario) {
  return (usuario.nombre.charAt(0) + usuario.apellido.charAt(0)).toUpperCase();
}

// Estructura común de las pantallas internas: menú lateral, barra superior y el contenido de la página.
// El menú solo muestra las opciones que el rol del usuario puede usar.
export default function Estructura({ titulo, children }) {
  const { usuario, cerrarSesion } = useAuth();
  const { oscuro, alternarTema } = useTema();
  const ruta = useRuta();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);

  // El menú de usuario se cierra al hacer clic en cualquier otro lugar
  useEffect(() => {
    const cerrar = () => setMenuUsuario(false);
    document.addEventListener('click', cerrar);
    return () => document.removeEventListener('click', cerrar);
  }, []);

  const opciones = MENU.filter((opcion) => opcion.roles.includes(usuario.rol));

  function salir(evento) {
    evento.preventDefault();
    cerrarSesion();
    navegar('/login');
  }

  return (
    <div className="im-shell">
      <aside className={'im-sidebar' + (menuAbierto ? ' open' : '')}>
        <div className="brand"><i className="bi bi-diagram-3-fill"></i> InfoManager</div>
        {opciones.map((opcion) => (
          <Enlace key={opcion.ruta} a={opcion.ruta}
                  className={'nav-item' + (ruta === opcion.ruta ? ' active' : '')}
                  onClick={() => setMenuAbierto(false)}>
            <i className={'bi ' + opcion.icono}></i> {opcion.texto}
          </Enlace>
        ))}
        <div className="nav-footer">
          <a href="/guia_estilos.html" className="nav-item" style={{ paddingLeft: 0 }}>
            <i className="bi bi-palette2"></i> Guía de estilos
          </a>
          <a href="#/login" className="nav-item" style={{ paddingLeft: 0 }} onClick={salir}>
            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
          </a>
        </div>
      </aside>

      <div className="im-main">
        <header className="im-topbar">
          <button className="im-menu-toggle" aria-label="Abrir menú" onClick={() => setMenuAbierto(!menuAbierto)}>
            <i className="bi bi-list"></i>
          </button>
          <h1 className="page-title">{titulo}</h1>
          <div className="im-topbar-right">
            <button className="theme-toggle" title="Cambiar tema claro/oscuro" aria-label="Cambiar tema"
                    onClick={alternarTema}>
              <i className={'bi ' + (oscuro ? 'bi-sun' : 'bi-moon-stars')}></i>
            </button>
            <div className="im-user-menu">
              <div className="user-chip" onClick={(e) => { e.stopPropagation(); setMenuUsuario(!menuUsuario); }}>
                <span className="text-muted">{usuario.nombre} {usuario.apellido} · {usuario.rol}</span>
                <div className="avatar">{iniciales(usuario)}</div>
              </div>
              <div className={'user-dropdown' + (menuUsuario ? ' show' : '')}>
                <Enlace a="/perfil"><i className="bi bi-person"></i> Ver perfil</Enlace>
                <hr />
                <a href="#/login" onClick={salir}><i className="bi bi-box-arrow-right"></i> Cerrar sesión</a>
              </div>
            </div>
          </div>
        </header>

        <main className="im-content">{children}</main>
      </div>
    </div>
  );
}
