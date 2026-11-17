import { useEffect, useState } from 'react';
import { EXTENSIONES_PERMITIDAS, TAMANO_MAXIMO, extensionDe } from '../utilidades.js';

// Valores iniciales del formulario: vacío para subir, o los datos del documento para editarlo.
function valoresIniciales(documento) {
  if (!documento) {
    return { titulo: '', descripcion: '', idCategoria: '', fechaVencimiento: '', estado: 'activo' };
  }
  return {
    titulo: documento.titulo,
    descripcion: documento.descripcion || '',
    idCategoria: String(documento.idCategoria),
    fechaVencimiento: documento.fechaVencimiento || '',
    estado: documento.estado
  };
}

// Revisa los campos y devuelve un objeto con un mensaje por cada campo incorrecto.
function validar(valores, archivo, edicion) {
  const errores = {};
  if (!valores.titulo.trim()) {
    errores.titulo = 'El título es obligatorio.';
  }
  if (!valores.idCategoria) {
    errores.idCategoria = 'Seleccione una categoría.';
  }
  if (!edicion) {
    if (!archivo) {
      errores.archivo = 'Seleccione el archivo.';
    } else if (!EXTENSIONES_PERMITIDAS.includes(extensionDe(archivo.name))) {
      errores.archivo = 'Tipo de archivo no permitido. Use pdf, doc, docx, xls, xlsx, ppt, pptx, txt, png, jpg o jpeg.';
    } else if (archivo.size === 0) {
      errores.archivo = 'El archivo está vacío.';
    } else if (archivo.size > TAMANO_MAXIMO) {
      errores.archivo = 'El archivo supera el tamaño máximo de 10 MB.';
    }
  }
  return errores;
}

// Mensaje de error de un campo (usa el estilo .field-error del prototipo).
function MensajeError({ mensaje }) {
  return <div className={'field-error' + (mensaje ? ' show' : '')}>{mensaje}</div>;
}

// Panel modal para subir un documento nuevo (documento = null) o editar uno existente.
// Quien sube el documento es el usuario que inició sesión, por eso ya no se elige en el formulario.
export default function ModalDocumento({ documento, categorias, onCerrar, onGuardar }) {
  const edicion = documento !== null;
  const [valores, setValores] = useState(() => valoresIniciales(documento));
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Se cierra con la tecla Escape
  useEffect(() => {
    const alPulsar = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [onCerrar]);

  function cambiar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const encontrados = validar(valores, archivo, edicion);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }
    setEnviando(true);
    try {
      await onGuardar(valores, archivo);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="im-modal-backdrop show" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="im-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>
          <i className={'bi ' + (edicion ? 'bi-pencil' : 'bi-upload') + ' me-1'}></i>{' '}
          {edicion ? 'Editar documento' : 'Subir documento'}
        </h3>
        <form onSubmit={enviar} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor="docTitulo">Título</label>
            <input type="text" id="docTitulo" maxLength={100} autoFocus
                   className={'form-control' + (errores.titulo ? ' is-invalid' : '')}
                   value={valores.titulo} onChange={(e) => cambiar('titulo', e.target.value)} />
            <MensajeError mensaje={errores.titulo} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor="docDescripcion">Descripción (opcional)</label>
            <input type="text" id="docDescripcion" maxLength={255} className="form-control"
                   value={valores.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor="docCategoria">Categoría</label>
            <select id="docCategoria" className={'form-select' + (errores.idCategoria ? ' is-invalid' : '')}
                    value={valores.idCategoria} onChange={(e) => cambiar('idCategoria', e.target.value)}>
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
            <MensajeError mensaje={errores.idCategoria} />
          </div>

          {!edicion && (
            <>
              <div className="mb-3">
                <label className="form-label small fw-semibold" htmlFor="docArchivo">Archivo (máximo 10 MB)</label>
                <input type="file" id="docArchivo"
                       accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                       className={'form-control' + (errores.archivo ? ' is-invalid' : '')}
                       onChange={(e) => setArchivo(e.target.files[0] || null)} />
                <MensajeError mensaje={errores.archivo} />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold" htmlFor="docVencimiento">
              Fecha de vencimiento (opcional)
            </label>
            <input type="date" id="docVencimiento" className="form-control" max="9999-12-31"
                   value={valores.fechaVencimiento} onChange={(e) => cambiar('fechaVencimiento', e.target.value)} />
            <div className="form-text">Déjala vacía si el documento no vence.</div>
          </div>

          {edicion && (
            <div className="mb-1">
              <label className="form-label small fw-semibold" htmlFor="docEstado">Estado</label>
              <select id="docEstado" className="form-select" value={valores.estado}
                      onChange={(e) => cambiar('estado', e.target.value)}>
                <option value="activo">Activo</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn-im-primary btn-sm" disabled={enviando}>
              {edicion ? 'Guardar cambios' : 'Guardar documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
