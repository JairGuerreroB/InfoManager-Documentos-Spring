import { useEffect, useState } from 'react';

const ENLACES = [
  { href: 'dashboard.html', icono: 'bi-house-door', texto: 'Panel' },
  { href: 'usuarios.html', icono: 'bi-people', texto: 'Usuarios' },
  { href: 'documentos.html', icono: 'bi-file-earmark-text', texto: 'Documentos', activo: true },
  { href: 'reportes.html', icono: 'bi-bar-chart', texto: 'Reportes' },
  { href: 'perfil.html', icono: 'bi-person-circle', texto: 'Perfil' }
];

// Estructura común de las pantallas: menú lateral, barra superior y el contenido de la página.
export default function Estructura({ titulo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [hayNotificaciones, setHayNotificaciones] = useState(true);
  const [oscuro, setOscuro] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // El menú de usuario se cierra al hacer clic en cualquier otro lugar
  useEffect(() => {
    const cerrar = () => setMenuUsuario(false);
    document.addEventListener('click', cerrar);
    return () => document.removeEventListener('click', cerrar);
  }, []);

  // Alterna el tema claro/oscuro y lo recuerda para las demás pantallas
  function alternarTema() {
    const nuevoOscuro = !oscuro;
    if (nuevoOscuro) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('im-theme', nuevoOscuro ? 'dark' : 'light');
    } catch (e) {
      // almacenamiento no disponible
    }
    setOscuro(nuevoOscuro);
  }

  return (
    <div className="im-shell">
      <aside className={'im-sidebar' + (menuAbierto ? ' open' : '')}>
        <div className="brand"><i className="bi bi-diagram-3-fill"></i> InfoManager</div>
        {ENLACES.map((enlace) => (
          <a key={enlace.href} href={enlace.href}
             className={'nav-item' + (enlace.activo ? ' active' : '')}
             onClick={() => setMenuAbierto(false)}>
            <i className={'bi ' + enlace.icono}></i> {enlace.texto}
          </a>
        ))}
        <div className="nav-footer">
          <a href="guia_estilos.html" className="nav-item" style={{ paddingLeft: 0 }}>
            <i className="bi bi-palette2"></i> Guía de estilos
          </a>
          <a href="login.html" className="nav-item" style={{ paddingLeft: 0 }}>
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
            <div className="im-notif" title="Notificaciones" onClick={() => setHayNotificaciones(false)}>
              <i className="bi bi-bell"></i>
              {hayNotificaciones && <span className="dot">3</span>}
            </div>
            <div className="im-user-menu">
              <div className="user-chip" onClick={(e) => { e.stopPropagation(); setMenuUsuario(!menuUsuario); }}>
                <span className="text-muted">Ana Martínez · Administradora</span>
                <div className="avatar">AM</div>
              </div>
              <div className={'user-dropdown' + (menuUsuario ? ' show' : '')}>
                <a href="perfil.html"><i className="bi bi-person"></i> Ver perfil</a>
                <a href="#"><i className="bi bi-gear"></i> Configuración</a>
                <hr />
                <a href="login.html"><i className="bi bi-box-arrow-right"></i> Cerrar sesión</a>
              </div>
            </div>
          </div>
        </header>

        <main className="im-content">{children}</main>
      </div>
    </div>
  );
}
