import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { iniciarSesion as pedirInicioDeSesion } from '../api.js';

// Contexto de sesión: guarda quién ha iniciado sesión y lo comparte con todos los componentes
// sin tener que pasarlo por props a través de cada nivel.
const AuthContext = createContext(null);

const CLAVE_SESION = 'im-sesion';

// La sesión se guarda en sessionStorage: sobrevive a recargar la página y se borra al cerrar la pestaña.
function leerSesion() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    return texto ? JSON.parse(texto) : null;
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  // Valida las credenciales en el servidor; si son correctas guarda al usuario. Lanza un error si no lo son.
  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const sesion = await pedirInicioDeSesion(correo, contrasena);
    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch (e) {
      // almacenamiento no disponible: la sesión dura mientras no se recargue la página
    }
    setUsuario(sesion);
    return sesion;
  }, []);

  const cerrarSesion = useCallback(() => {
    try {
      sessionStorage.removeItem(CLAVE_SESION);
    } catch (e) {
      // nada que limpiar
    }
    setUsuario(null);
  }, []);

  // useMemo evita que los componentes se redibujen si el valor no cambió
  const valor = useMemo(() => ({ usuario, iniciarSesion, cerrarSesion }), [usuario, iniciarSesion, cerrarSesion]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/** Hook para leer la sesión: devuelve { usuario, iniciarSesion, cerrarSesion }. */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}
