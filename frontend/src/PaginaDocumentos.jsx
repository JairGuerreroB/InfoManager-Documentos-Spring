import { useCallback, useEffect, useState } from 'react';
import Estructura from './componentes/Estructura.jsx';
import FiltrosDocumentos from './componentes/FiltrosDocumentos.jsx';
import TablaDocumentos from './componentes/TablaDocumentos.jsx';
import ModalDocumento from './componentes/ModalDocumento.jsx';
import PilaAvisos from './componentes/PilaAvisos.jsx';
import { useAvisos } from './ganchos/useAvisos.js';
import { useRetraso } from './ganchos/useRetraso.js';
import {
  actualizarDocumento, eliminarDocumento, listarCategorias,
  listarDocumentos, listarUsuarios, subirDocumento
} from './api.js';

// Componente principal: guarda el estado de la pantalla y coordina la tabla, los filtros y el formulario.
export default function PaginaDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ texto: '', idCategoria: '', vigencia: '' });
  const [modal, setModal] = useState({ abierto: false, documento: null });
  const [cargando, setCargando] = useState(true);
  const { avisos, avisar } = useAvisos();

  // La búsqueda por texto espera 300 ms tras la última tecla antes de consultar
  const textoRetrasado = useRetraso(filtros.texto, 300);

  // Las listas desplegables se cargan una sola vez, al abrir la pantalla
  useEffect(() => {
    Promise.all([listarCategorias(), listarUsuarios()])
      .then(([listaCategorias, listaUsuarios]) => {
        setCategorias(listaCategorias);
        setUsuarios(listaUsuarios);
      })
      .catch((e) => avisar(e.message, 'danger'));
  }, [avisar]);

  // Consulta los documentos aplicando los filtros vigentes
  const cargar = useCallback(async () => {
    try {
      setDocumentos(await listarDocumentos({
        texto: textoRetrasado,
        idCategoria: filtros.idCategoria,
        vigencia: filtros.vigencia
      }));
    } catch (e) {
      avisar(e.message, 'danger');
    } finally {
      setCargando(false);
    }
  }, [textoRetrasado, filtros.idCategoria, filtros.vigencia, avisar]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function cambiarFiltro(campo, valor) {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  }

  const cerrarModal = useCallback(() => setModal({ abierto: false, documento: null }), []);

  // Sube un documento nuevo o guarda los cambios de uno existente
  async function guardar(valores, archivo) {
    try {
      if (modal.documento === null) {
        const datos = new FormData();
        datos.append('titulo', valores.titulo.trim());
        datos.append('descripcion', valores.descripcion.trim());
        datos.append('idCategoria', valores.idCategoria);
        datos.append('idUsuario', valores.idUsuario);
        if (valores.fechaVencimiento) datos.append('fechaVencimiento', valores.fechaVencimiento);
        datos.append('archivo', archivo);
        await subirDocumento(datos);
        avisar('Documento subido correctamente.');
      } else {
        await actualizarDocumento(modal.documento.idDocumento, {
          titulo: valores.titulo.trim(),
          descripcion: valores.descripcion.trim(),
          idCategoria: Number(valores.idCategoria),
          fechaVencimiento: valores.fechaVencimiento || null,
          estado: valores.estado
        });
        avisar('Documento actualizado correctamente.');
      }
      cerrarModal();
      await cargar();
    } catch (e) {
      avisar(e.message, 'danger');
    }
  }

  async function eliminar(documento) {
    if (!window.confirm(`¿Eliminar el documento "${documento.titulo}"? También se borrará su archivo.`)) {
      return;
    }
    try {
      await eliminarDocumento(documento.idDocumento);
      avisar('Documento eliminado.');
      await cargar();
    } catch (e) {
      avisar(e.message, 'danger');
    }
  }

  return (
    <Estructura titulo="Gestión de documentos">
      <nav className="im-breadcrumb">
        <a href="dashboard.html">Panel administrativo</a>
        <span className="sep">/</span>
        <span className="current">Documentos</span>
      </nav>

      <div className="block">
        <FiltrosDocumentos categorias={categorias} filtros={filtros} onCambiar={cambiarFiltro}
                           onSubir={() => setModal({ abierto: true, documento: null })} />
        <TablaDocumentos documentos={documentos} cargando={cargando}
                         onEditar={(documento) => setModal({ abierto: true, documento })}
                         onEliminar={eliminar} />
      </div>

      {modal.abierto && (
        <ModalDocumento key={modal.documento ? modal.documento.idDocumento : 'nuevo'}
                        documento={modal.documento} categorias={categorias} usuarios={usuarios}
                        onCerrar={cerrarModal} onGuardar={guardar} />
      )}
      <PilaAvisos avisos={avisos} />
    </Estructura>
  );
}
