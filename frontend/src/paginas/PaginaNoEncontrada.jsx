import EstadoVacio from '../componentes/EstadoVacio.jsx';
import { Enlace } from '../enrutador/enrutador.jsx';

// Se muestra cuando la dirección no corresponde a ninguna pantalla.
export default function PaginaNoEncontrada() {
  return (
    <div className="block">
      <EstadoVacio mensaje="La pantalla que busca no existe." icono="bi-question-circle" />
      <div className="text-center mt-3"><Enlace a="/">Ir al inicio</Enlace></div>
    </div>
  );
}
