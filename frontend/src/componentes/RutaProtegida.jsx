import { Redirigir } from '../enrutador/enrutador.jsx';
import { useAuth } from '../contexto/AuthContext.jsx';
import Estructura from './Estructura.jsx';
import EstadoVacio from './EstadoVacio.jsx';

// Protege una pantalla: sin sesión lleva al login y, si el rol no tiene permiso, muestra un aviso.
// Es una barrera de la interfaz; la protección real de los datos corresponde al servidor.
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Redirigir a="/login" />;
  }
  if (!roles.includes(usuario.rol)) {
    return (
      <Estructura titulo="Acceso restringido">
        <EstadoVacio icono="bi-shield-lock" mensaje="Su rol no tiene permiso para ver esta pantalla." />
      </Estructura>
    );
  }
  return children;
}
