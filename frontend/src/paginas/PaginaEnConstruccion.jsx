// Pantalla provisional de los módulos que se construirán en próximas evidencias (usuarios, reportes y perfil).
// Mientras tanto ofrece un enlace al prototipo HTML de esa pantalla.
export default function PaginaEnConstruccion({ modulo, prototipo }) {
  return (
    <div className="block text-center py-5">
      <i className="bi bi-tools" style={{ fontSize: '2.5rem', color: '#2E5C8A' }}></i>
      <h5 className="mt-3">Módulo de {modulo}</h5>
      <p className="text-muted mb-4">
        Este módulo se construirá en una próxima evidencia. Mientras tanto puede ver el prototipo de la pantalla.
      </p>
      <a className="btn btn-im-primary" href={prototipo}>Ver prototipo</a>
    </div>
  );
}
