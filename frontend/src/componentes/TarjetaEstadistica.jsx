// Tarjeta del panel con un icono, una cifra y una etiqueta. El detalle (opcional) se muestra en rojo debajo.
export default function TarjetaEstadistica({ icono, valor, etiqueta, detalle }) {
  return (
    <div className="col-md-3">
      <div className="stat-card">
        <div className="stat-icon"><i className={'bi ' + icono}></i></div>
        <div>
          <div className="stat-value">{valor}</div>
          <div className="stat-label">{etiqueta}</div>
          {detalle && <div className="small text-danger">{detalle}</div>}
        </div>
      </div>
    </div>
  );
}
