// Mensajes emergentes en la esquina superior derecha (usa los estilos .toast-stack e .im-toast).
export default function PilaAvisos({ avisos }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {avisos.map((aviso) => (
        <div key={aviso.id} className={'im-toast show' + (aviso.tipo === 'danger' ? ' danger' : '')}>
          <i className={'bi ' + (aviso.tipo === 'danger' ? 'bi-exclamation-circle' : 'bi-check-circle')}></i>
          <span>{aviso.mensaje}</span>
        </div>
      ))}
    </div>
  );
}
