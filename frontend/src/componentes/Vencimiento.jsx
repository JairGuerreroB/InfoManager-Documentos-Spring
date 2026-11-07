import { formatearFecha } from '../utilidades.js';

// Celda "Vence": muestra la fecha y una insignia según la vigencia que calculó el servidor.
export default function Vencimiento({ documento }) {
  const { vigencia, fechaVencimiento, diasParaVencer: dias } = documento;

  if (vigencia === 'sin_vencimiento') {
    return <span className="text-muted small">Sin vencimiento</span>;
  }

  let insignia;
  if (vigencia === 'vencido') {
    const atraso = -dias;
    insignia = (
      <span className="badge bg-danger">Vencido hace {atraso} {atraso === 1 ? 'día' : 'días'}</span>
    );
  } else if (vigencia === 'por_vencer') {
    insignia = (
      <span className="badge bg-warning text-dark">
        {dias === 0 ? 'Vence hoy' : `Vence en ${dias} ${dias === 1 ? 'día' : 'días'}`}
      </span>
    );
  } else {
    insignia = <span className="badge bg-success">Vigente</span>;
  }

  return (
    <>
      {formatearFecha(fechaVencimiento)}
      <div>{insignia}</div>
    </>
  );
}
