import Vencimiento from './Vencimiento.jsx';
import { formatearFecha, iconoArchivo } from '../utilidades.js';
import { urlArchivo } from '../api.js';

// Una fila de la tabla: datos del documento y sus acciones (descargar, editar, eliminar).
function FilaDocumento({ documento, onEditar, onEliminar }) {
  const icono = iconoArchivo(documento.extension);
  const activo = documento.estado === 'activo';

  return (
    <tr>
      <td>
        <i className={'bi ' + icono.clase + ' me-2'} style={{ color: icono.color }}></i>
        <span className="fw-semibold">{documento.titulo}</span>
        {documento.descripcion && <div className="small text-muted">{documento.descripcion}</div>}
      </td>
      <td><span className="badge bg-secondary">{documento.categoria}</span></td>
      <td>{documento.subidoPor}</td>
      <td>{formatearFecha(documento.fechaSubida)}</td>
      <td><Vencimiento documento={documento} /></td>
      <td>
        <span className={'badge ' + (activo ? 'bg-success' : 'bg-secondary')}>
          {activo ? 'Activo' : 'Archivado'}
        </span>
      </td>
      <td className="text-end text-nowrap">
        <a className="action-icon me-2" href={urlArchivo(documento.idDocumento)}
           title="Descargar" aria-label="Descargar documento">
          <i className="bi bi-download" style={{ color: '#2E5C8A' }}></i>
        </a>
        <button type="button" className="btn p-0 border-0 bg-transparent action-icon me-2"
                title="Editar" aria-label="Editar documento" onClick={() => onEditar(documento)}>
          <i className="bi bi-pencil" style={{ color: '#2E5C8A' }}></i>
        </button>
        <button type="button" className="btn p-0 border-0 bg-transparent action-icon"
                title="Eliminar" aria-label="Eliminar documento" onClick={() => onEliminar(documento)}>
          <i className="bi bi-trash" style={{ color: '#DC3545' }}></i>
        </button>
      </td>
    </tr>
  );
}

// Tabla de documentos. Si no hay resultados muestra un aviso en lugar de filas.
export default function TablaDocumentos({ documentos, cargando, onEditar, onEliminar }) {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Documento</th><th>Categoría</th><th>Subido por</th><th>Fecha</th>
              <th>Vence</th><th>Estado</th><th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((documento) => (
              <FilaDocumento key={documento.idDocumento} documento={documento}
                             onEditar={onEditar} onEliminar={onEliminar} />
            ))}
          </tbody>
        </table>
      </div>
      {!cargando && documentos.length === 0 && (
        <div className="empty-state show">
          <i className="bi bi-search"></i>
          No hay documentos para mostrar.
        </div>
      )}
    </>
  );
}
