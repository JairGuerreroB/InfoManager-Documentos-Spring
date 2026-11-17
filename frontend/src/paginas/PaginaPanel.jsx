import { useEffect, useState } from 'react';
import TarjetaEstadistica from '../componentes/TarjetaEstadistica.jsx';
import EstadoVacio from '../componentes/EstadoVacio.jsx';
import Vencimiento from '../componentes/Vencimiento.jsx';
import { Enlace } from '../enrutador/enrutador.jsx';
import { listarDocumentos, listarUsuarios, obtenerResumen } from '../api.js';

// Tabla corta con documentos y su vencimiento (se usa para los próximos a vencer y los vencidos)
function TablaVencimientos({ documentos, vacio }) {
  if (documentos.length === 0) {
    return <EstadoVacio mensaje={vacio} icono="bi-check-circle" />;
  }
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr><th>Documento</th><th>Categoría</th><th>Vence</th></tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.idDocumento}>
              <td className="fw-semibold">{documento.titulo}</td>
              <td><span className="badge bg-secondary">{documento.categoria}</span></td>
              <td><Vencimiento documento={documento} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Agrupa los documentos activos por categoría y calcula el porcentaje de cada una
function porCategoria(documentos) {
  const conteo = {};
  documentos.forEach((d) => { conteo[d.categoria] = (conteo[d.categoria] || 0) + 1; });
  return Object.entries(conteo)
    .map(([categoria, cantidad]) => ({ categoria, cantidad, porcentaje: Math.round((cantidad * 100) / documentos.length) }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

// Panel administrativo: cifras reales de la base de datos, próximos vencimientos y documentos por categoría.
export default function PaginaPanel() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  // Se consultan todos los datos a la vez al abrir la pantalla
  useEffect(() => {
    let vigente = true; // evita actualizar el estado si el componente ya se cerró
    Promise.all([
      obtenerResumen(),
      listarDocumentos({ vigencia: 'por_vencer' }),
      listarDocumentos({ vigencia: 'vencido' }),
      listarDocumentos({}),
      listarUsuarios()
    ])
      .then(([resumen, porVencer, vencidos, todos, usuarios]) => {
        if (!vigente) return;
        const activos = (lista) => lista.filter((d) => d.estado === 'activo');
        setDatos({
          resumen,
          usuarios: usuarios.length,
          porVencer: activos(porVencer).sort((a, b) => a.diasParaVencer - b.diasParaVencer).slice(0, 5),
          vencidos: activos(vencidos).sort((a, b) => b.diasParaVencer - a.diasParaVencer).slice(0, 5),
          categorias: porCategoria(activos(todos))
        });
      })
      .catch((e) => { if (vigente) setError(e.message); });
    return () => { vigente = false; };
  }, []);

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }
  if (!datos) {
    return <p className="text-muted">Cargando datos del panel...</p>;
  }

  const { resumen } = datos;
  return (
    <>
      <div className="row g-3 mb-2">
        <TarjetaEstadistica icono="bi-people-fill" valor={datos.usuarios} etiqueta="Usuarios registrados" />
        <TarjetaEstadistica icono="bi-file-earmark-text-fill" valor={resumen.activos} etiqueta="Documentos activos" />
        <TarjetaEstadistica icono="bi-hourglass-split" valor={resumen.porVencer} etiqueta="Por vencer (30 días)"
                            detalle={resumen.vencidos > 0 ? `${resumen.vencidos} ${resumen.vencidos === 1 ? 'vencido' : 'vencidos'}` : ''} />
        <TarjetaEstadistica icono="bi-archive-fill" valor={resumen.archivados} etiqueta="Documentos archivados" />
      </div>

      <div className="row g-3">
        <div className="col-md-7">
          <div className="block mb-3">
            <h6 className="section-title">Próximos vencimientos</h6>
            <TablaVencimientos documentos={datos.porVencer} vacio="No hay documentos por vencer." />
          </div>
          <div className="block">
            <h6 className="section-title">Documentos vencidos</h6>
            <TablaVencimientos documentos={datos.vencidos} vacio="No hay documentos vencidos." />
            <div className="mt-3 text-end"><Enlace a="/documentos">Ver todos los documentos</Enlace></div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="block">
            <h6 className="section-title">Documentos activos por categoría</h6>
            {datos.categorias.length === 0 && <EstadoVacio mensaje="Aún no hay documentos." icono="bi-folder2-open" />}
            {datos.categorias.map((c, i) => (
              <div key={c.categoria} className={i < datos.categorias.length - 1 ? 'mb-3' : ''}>
                <div className="mb-2 d-flex justify-content-between small">
                  <span>{c.categoria}</span><span className="text-muted">{c.porcentaje}% ({c.cantidad})</span>
                </div>
                <div className="im-bar-track"><div className="im-bar-fill" style={{ width: c.porcentaje + '%' }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
