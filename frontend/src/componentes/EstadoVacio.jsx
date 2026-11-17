// Mensaje con icono para cuando no hay datos que mostrar (usa el estilo .empty-state del prototipo).
export default function EstadoVacio({ mensaje, icono = 'bi-search' }) {
  return (
    <div className="empty-state show">
      <i className={'bi ' + icono}></i>
      {mensaje}
    </div>
  );
}
