// InfoManager System — Gestión de documentos
// Esta pantalla consume la API REST del módulo de documentos (Spring Boot + Hibernate):
//   GET    /api/documentos           lista con filtros (texto, idCategoria, vigencia)
//   POST   /api/documentos           sube un documento con su archivo
//   PUT    /api/documentos/{id}      modifica sus datos
//   DELETE /api/documentos/{id}      elimina
//   GET    /api/categorias y /api/usuarios   llenan las listas desplegables
// Depende de assets/app.js (imShowToast e imValidateField).
(function () {
  'use strict';

  var API = '/api';
  var TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB, igual que el límite del servidor

  // ---- Elementos de la página ----
  var cuerpoTabla = document.querySelector('#tablaDocumentos tbody');
  var avisoVacio = document.getElementById('documentosVacio');
  var filtroTexto = document.getElementById('buscarDocumento');
  var filtroCategoria = document.getElementById('filtroCategoria');
  var filtroVigencia = document.getElementById('filtroVigencia');
  var modal = document.getElementById('modalDocumento');
  var formulario = document.getElementById('formDocumento');
  var botonGuardar = document.getElementById('btnGuardarDoc');
  var campos = {
    titulo: document.getElementById('docTitulo'),
    descripcion: document.getElementById('docDescripcion'),
    categoria: document.getElementById('docCategoria'),
    usuario: document.getElementById('docUsuario'),
    archivo: document.getElementById('docArchivo'),
    vencimiento: document.getElementById('docVencimiento'),
    estado: document.getElementById('docEstado')
  };

  var documentos = [];          // última lista recibida de la API
  var documentoEnEdicion = null; // null cuando se está subiendo un documento nuevo
  var temporizador = null;       // retraso (debounce) de la búsqueda mientras se escribe

  // ---------------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------------

  // Evita que texto con símbolos HTML se interprete como código al mostrarlo en la tabla.
  function escapar(texto) {
    return String(texto === null || texto === undefined ? '' : texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Convierte 2026-12-31 (o 2026-12-31T10:00:00) en 31/12/2026 sin desfases de zona horaria.
  function formatearFecha(iso) {
    if (!iso) { return '—'; }
    var partes = iso.substring(0, 10).split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  function avisar(mensaje, tipo) {
    imShowToast(escapar(mensaje), tipo);
  }

  // Llama a la API. Si responde con error, lanza una excepción con el mensaje del servidor.
  async function pedir(ruta, opciones) {
    var respuesta;
    try {
      respuesta = await fetch(API + ruta, opciones);
    } catch (e) {
      throw new Error('No se pudo conectar con el servidor. Verifique que la aplicación esté en ejecución.');
    }
    if (!respuesta.ok) {
      var mensaje = 'Ocurrió un error inesperado (' + respuesta.status + ').';
      try {
        var cuerpo = await respuesta.json();
        if (cuerpo && cuerpo.mensaje) { mensaje = cuerpo.mensaje; }
      } catch (e) { /* la respuesta no trae JSON */ }
      throw new Error(mensaje);
    }
    return respuesta.status === 204 ? null : respuesta.json();
  }

  // ---------------------------------------------------------------------
  // Tabla de documentos
  // ---------------------------------------------------------------------

  function iconoArchivo(extension) {
    var iconos = {
      pdf: ['bi-file-earmark-pdf', '#DC3545'],
      doc: ['bi-file-earmark-word', '#2E5C8A'], docx: ['bi-file-earmark-word', '#2E5C8A'],
      xls: ['bi-file-earmark-excel', '#1E7B34'], xlsx: ['bi-file-earmark-excel', '#1E7B34'],
      ppt: ['bi-file-earmark-ppt', '#C4501B'], pptx: ['bi-file-earmark-ppt', '#C4501B'],
      png: ['bi-file-earmark-image', '#6F42C1'], jpg: ['bi-file-earmark-image', '#6F42C1'],
      jpeg: ['bi-file-earmark-image', '#6F42C1']
    };
    var icono = iconos[extension] || ['bi-file-earmark-text', '#6C757D'];
    return '<i class="bi ' + icono[0] + ' me-2" style="color:' + icono[1] + ';"></i>';
  }

  // Muestra la fecha de vencimiento y una insignia según la vigencia calculada por el servidor.
  function celdaVencimiento(d) {
    if (d.vigencia === 'sin_vencimiento') {
      return '<span class="text-muted small">Sin vencimiento</span>';
    }
    var fecha = formatearFecha(d.fechaVencimiento);
    var dias = d.diasParaVencer;
    if (d.vigencia === 'vencido') {
      var atraso = -dias;
      return fecha + '<div><span class="badge bg-danger">Vencido hace ' + atraso +
        (atraso === 1 ? ' día' : ' días') + '</span></div>';
    }
    if (d.vigencia === 'por_vencer') {
      var texto = dias === 0 ? 'Vence hoy' : 'Vence en ' + dias + (dias === 1 ? ' día' : ' días');
      return fecha + '<div><span class="badge bg-warning text-dark">' + texto + '</span></div>';
    }
    return fecha + '<div><span class="badge bg-success">Vigente</span></div>';
  }

  function filaHtml(d) {
    var estado = d.estado === 'activo'
      ? '<span class="badge bg-success">Activo</span>'
      : '<span class="badge bg-secondary">Archivado</span>';
    return '<tr>' +
      '<td>' + iconoArchivo(d.extension) + '<span class="fw-semibold">' + escapar(d.titulo) + '</span>' +
        (d.descripcion ? '<div class="small text-muted">' + escapar(d.descripcion) + '</div>' : '') + '</td>' +
      '<td><span class="badge bg-secondary">' + escapar(d.categoria) + '</span></td>' +
      '<td>' + escapar(d.subidoPor) + '</td>' +
      '<td>' + formatearFecha(d.fechaSubida) + '</td>' +
      '<td>' + celdaVencimiento(d) + '</td>' +
      '<td>' + estado + '</td>' +
      '<td class="text-end text-nowrap">' +
        '<a class="action-icon me-2" href="' + API + '/documentos/' + d.idDocumento + '/archivo" ' +
          'title="Descargar" aria-label="Descargar documento"><i class="bi bi-download" style="color:#2E5C8A;"></i></a>' +
        '<button type="button" class="btn p-0 border-0 bg-transparent action-icon me-2" data-accion="editar" ' +
          'data-id="' + d.idDocumento + '" title="Editar" aria-label="Editar documento">' +
          '<i class="bi bi-pencil" style="color:#2E5C8A;"></i></button>' +
        '<button type="button" class="btn p-0 border-0 bg-transparent action-icon" data-accion="eliminar" ' +
          'data-id="' + d.idDocumento + '" title="Eliminar" aria-label="Eliminar documento">' +
          '<i class="bi bi-trash" style="color:#DC3545;"></i></button>' +
      '</td></tr>';
  }

  function pintarTabla() {
    cuerpoTabla.innerHTML = documentos.map(filaHtml).join('');
    avisoVacio.classList.toggle('show', documentos.length === 0);
  }

  // Pide los documentos a la API aplicando los filtros que haya seleccionados.
  async function cargarDocumentos() {
    var parametros = new URLSearchParams();
    if (filtroTexto.value.trim()) { parametros.set('texto', filtroTexto.value.trim()); }
    if (filtroCategoria.value) { parametros.set('idCategoria', filtroCategoria.value); }
    if (filtroVigencia.value) { parametros.set('vigencia', filtroVigencia.value); }
    documentos = await pedir('/documentos?' + parametros.toString());
    pintarTabla();
  }

  // ---------------------------------------------------------------------
  // Listas desplegables
  // ---------------------------------------------------------------------

  function llenarLista(lista, items, textoInicial) {
    var opciones = textoInicial === null ? '' : '<option value="">' + escapar(textoInicial) + '</option>';
    items.forEach(function (item) {
      opciones += '<option value="' + item.id + '">' + escapar(item.nombre) + '</option>';
    });
    lista.innerHTML = opciones;
  }

  async function cargarCatalogos() {
    var resultados = await Promise.all([pedir('/categorias'), pedir('/usuarios')]);
    var categorias = resultados[0];
    var usuarios = resultados[1];
    llenarLista(filtroCategoria, categorias, 'Todas las categorías');
    llenarLista(campos.categoria, categorias, 'Seleccione una categoría');
    llenarLista(campos.usuario, usuarios,
      usuarios.length ? 'Seleccione un usuario' : 'No hay usuarios registrados');
  }

  // ---------------------------------------------------------------------
  // Panel modal (subir y editar)
  // ---------------------------------------------------------------------

  function limpiarValidacion() {
    formulario.querySelectorAll('.is-invalid, .is-valid').forEach(function (el) {
      el.classList.remove('is-invalid', 'is-valid');
    });
    formulario.querySelectorAll('.field-error').forEach(function (el) {
      el.classList.remove('show');
    });
  }

  // Sin documento: formulario para subir uno nuevo. Con documento: edición de sus datos.
  function abrirModal(documento) {
    documentoEnEdicion = documento || null;
    var edicion = documentoEnEdicion !== null;
    formulario.reset();
    limpiarValidacion();

    document.querySelectorAll('#formDocumento .solo-nuevo').forEach(function (el) { el.hidden = edicion; });
    document.querySelectorAll('#formDocumento .solo-edicion').forEach(function (el) { el.hidden = !edicion; });
    document.getElementById('modalDocumentoTitulo').innerHTML = edicion
      ? '<i class="bi bi-pencil me-1"></i> Editar documento'
      : '<i class="bi bi-upload me-1"></i> Subir documento';
    botonGuardar.textContent = edicion ? 'Guardar cambios' : 'Guardar documento';

    if (edicion) {
      campos.titulo.value = documento.titulo;
      campos.descripcion.value = documento.descripcion || '';
      campos.categoria.value = documento.idCategoria;
      campos.vencimiento.value = documento.fechaVencimiento || '';
      campos.estado.value = documento.estado;
    }
    modal.classList.add('show');
    campos.titulo.focus();
  }

  function cerrarModal() {
    modal.classList.remove('show');
  }

  // Valida los campos visibles; devuelve true si todos son correctos.
  function formularioValido() {
    var aValidar = [campos.titulo, campos.categoria];
    if (documentoEnEdicion === null) {
      campos.usuario.required = true;
      campos.archivo.required = true;
      aValidar.push(campos.usuario, campos.archivo);
    }
    var valido = true;
    aValidar.forEach(function (campo) {
      if (!imValidateField(campo)) { valido = false; }
    });
    if (valido && documentoEnEdicion === null) {
      var archivo = campos.archivo.files[0];
      if (archivo && archivo.size > TAMANO_MAXIMO) {
        avisar('El archivo supera el tamaño máximo de 10 MB.', 'danger');
        valido = false;
      }
    }
    return valido;
  }

  async function guardar(evento) {
    evento.preventDefault();
    if (!formularioValido()) { return; }

    botonGuardar.disabled = true;
    try {
      if (documentoEnEdicion === null) {
        // Subida de archivo: se envía como multipart/form-data
        var datos = new FormData();
        datos.append('titulo', campos.titulo.value.trim());
        datos.append('descripcion', campos.descripcion.value.trim());
        datos.append('idCategoria', campos.categoria.value);
        datos.append('idUsuario', campos.usuario.value);
        if (campos.vencimiento.value) { datos.append('fechaVencimiento', campos.vencimiento.value); }
        datos.append('archivo', campos.archivo.files[0]);
        await pedir('/documentos', { method: 'POST', body: datos });
        avisar('Documento subido correctamente.');
      } else {
        // Edición: solo cambian los datos, se envían como JSON
        await pedir('/documentos/' + documentoEnEdicion.idDocumento, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: campos.titulo.value.trim(),
            descripcion: campos.descripcion.value.trim(),
            idCategoria: Number(campos.categoria.value),
            fechaVencimiento: campos.vencimiento.value || null,
            estado: campos.estado.value
          })
        });
        avisar('Documento actualizado correctamente.');
      }
      cerrarModal();
      await cargarDocumentos();
    } catch (e) {
      avisar(e.message, 'danger');
    } finally {
      botonGuardar.disabled = false;
    }
  }

  async function eliminar(id) {
    var documento = documentos.find(function (d) { return d.idDocumento === id; });
    var nombre = documento ? documento.titulo : 'seleccionado';
    if (!confirm('¿Eliminar el documento "' + nombre + '"? También se borrará su archivo.')) { return; }
    try {
      await pedir('/documentos/' + id, { method: 'DELETE' });
      avisar('Documento eliminado.');
      await cargarDocumentos();
    } catch (e) {
      avisar(e.message, 'danger');
    }
  }

  // ---------------------------------------------------------------------
  // Eventos e inicio
  // ---------------------------------------------------------------------

  function recargar() {
    cargarDocumentos().catch(function (e) { avisar(e.message, 'danger'); });
  }

  // La búsqueda espera un momento tras la última tecla para no consultar en cada letra.
  filtroTexto.addEventListener('input', function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(recargar, 300);
  });
  filtroCategoria.addEventListener('change', recargar);
  filtroVigencia.addEventListener('change', recargar);

  document.getElementById('btnSubirDocumento').addEventListener('click', function () { abrirModal(null); });
  document.getElementById('btnCancelarDoc').addEventListener('click', cerrarModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) { cerrarModal(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cerrarModal(); } });
  formulario.addEventListener('submit', guardar);

  // Los botones de cada fila se manejan con un solo escuchador (delegación de eventos).
  cuerpoTabla.addEventListener('click', function (e) {
    var boton = e.target.closest('button[data-accion]');
    if (!boton) { return; }
    var id = Number(boton.getAttribute('data-id'));
    if (boton.getAttribute('data-accion') === 'editar') {
      var documento = documentos.find(function (d) { return d.idDocumento === id; });
      if (documento) { abrirModal(documento); }
    } else {
      eliminar(id);
    }
  });

  cargarCatalogos()
    .then(cargarDocumentos)
    .catch(function (e) { avisar(e.message, 'danger'); });
})();
