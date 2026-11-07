// Barra superior de la tabla: filtros (categoría, vigencia, texto) y botón para subir un documento.
export default function FiltrosDocumentos({ categorias, filtros, onCambiar, onSubir }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div className="d-flex flex-wrap gap-2">
        <select className="form-select" style={{ maxWidth: '180px' }} aria-label="Filtrar por categoría"
                value={filtros.idCategoria} onChange={(e) => onCambiar('idCategoria', e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
        <select className="form-select" style={{ maxWidth: '180px' }} aria-label="Filtrar por vigencia"
                value={filtros.vigencia} onChange={(e) => onCambiar('vigencia', e.target.value)}>
          <option value="">Toda vigencia</option>
          <option value="vigente">Vigentes</option>
          <option value="por_vencer">Por vencer</option>
          <option value="vencido">Vencidos</option>
          <option value="sin_vencimiento">Sin vencimiento</option>
        </select>
        <div className="input-group" style={{ maxWidth: '280px' }}>
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control" placeholder="Buscar documento..."
                 aria-label="Buscar documento" value={filtros.texto}
                 onChange={(e) => onCambiar('texto', e.target.value)} />
        </div>
      </div>
      <button className="btn btn-im-primary" onClick={onSubir}>
        <i className="bi bi-upload me-1"></i> Subir documento
      </button>
    </div>
  );
}
