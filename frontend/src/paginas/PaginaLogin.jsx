import { useState } from 'react';
import { navegar } from '../enrutador/enrutador.jsx';
import { useAuth } from '../contexto/AuthContext.jsx';
import { useTema } from '../ganchos/useTema.js';
import { rutaInicial } from '../rutas.js';

// Valida el formato de los campos antes de llamar al servidor
function validar(correo, contrasena) {
  const errores = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errores.correo = 'Ingresa un correo electrónico válido.';
  }
  if (!contrasena) {
    errores.contrasena = 'La contraseña es obligatoria.';
  }
  return errores;
}

// Pantalla de inicio de sesión. Si las credenciales son correctas, lleva a la pantalla inicial del rol.
export default function PaginaLogin() {
  const { iniciarSesion } = useAuth();
  const { oscuro, alternarTema } = useTema();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErrorServidor('');
    const encontrados = validar(correo, contrasena);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }
    setEnviando(true);
    try {
      const sesion = await iniciarSesion(correo.trim(), contrasena);
      navegar(rutaInicial(sesion.rol), { reemplazar: true });
    } catch (e) {
      setErrorServidor(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button className="theme-toggle" title="Cambiar tema claro/oscuro" aria-label="Cambiar tema" onClick={alternarTema}
              style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10 }}>
        <i className={'bi ' + (oscuro ? 'bi-sun' : 'bi-moon-stars')}></i>
      </button>
      <div className="login-wrap">
        <div className="brand-panel">
          <i className="bi bi-diagram-3-fill" style={{ fontSize: '3rem', opacity: 0.9 }}></i>
          <h1>InfoManager<br />System</h1>
          <p>Plataforma centralizada para la gestión de usuarios, documentos y reportes administrativos.</p>
          <div className="feature"><i className="bi bi-shield-check"></i> Acceso seguro por roles</div>
          <div className="feature"><i className="bi bi-folder2-open"></i> Gestión documental centralizada</div>
          <div className="feature"><i className="bi bi-bar-chart-line"></i> Control de vencimientos</div>
        </div>
        <div className="login-panel">
          <div className="login-card">
            <h3 className="mb-1">Iniciar sesión</h3>
            <p className="text-muted mb-4">Ingresa tus credenciales para acceder a InfoManager System.</p>
            <form onSubmit={enviar} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="loginCorreo">Correo electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input type="email" id="loginCorreo" autoFocus autoComplete="username"
                         className={'form-control' + (errores.correo ? ' is-invalid' : '')}
                         value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </div>
                <div className={'field-error' + (errores.correo ? ' show' : '')}>{errores.correo}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="loginContrasena">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input type={verContrasena ? 'text' : 'password'} id="loginContrasena" autoComplete="current-password"
                         className={'form-control' + (errores.contrasena ? ' is-invalid' : '')}
                         value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                  <button className="btn btn-outline-secondary" type="button" tabIndex={-1}
                          aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          onClick={() => setVerContrasena(!verContrasena)}>
                    <i className={'bi ' + (verContrasena ? 'bi-eye-slash' : 'bi-eye')}></i>
                  </button>
                </div>
                <div className={'field-error' + (errores.contrasena ? ' show' : '')}>{errores.contrasena}</div>
              </div>

              {errorServidor && <div className="alert alert-danger py-2" role="alert">{errorServidor}</div>}

              <button type="submit" className="btn btn-login btn-lg w-100 text-white mt-2" disabled={enviando}>
                <i className="bi bi-box-arrow-in-right me-1"></i> {enviando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
            <div className="divider"><span>InfoManager System</span></div>
            <p className="text-center text-muted small mb-0">Proyecto formativo · Análisis y Desarrollo de Software</p>
          </div>
        </div>
      </div>
    </>
  );
}
