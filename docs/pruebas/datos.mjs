// Datos del documento de pruebas: historias de usuario, casos de uso y casos de prueba.
// Para cambiar un texto del documento basta con editar este archivo y volver a ejecutar generar.mjs.

export const portada = {
  entidad: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA',
  programa: 'Análisis y Desarrollo de Software (ADSO)',
  sistema: 'InfoManager System',
  titulo: 'Documento de pruebas del módulo de Documentos',
  evidencia: 'Evidencia GA7-220501096-AA3-EV02',
  aprendiz: 'Jair Guerrero',
  ficha: '3336142',
  instructor: 'Juan Hernández',
  fecha: 'Noviembre de 2026',
  repositorio: 'https://github.com/JairGuerreroB/InfoManager-Documentos-Spring'
};

export const entorno = [
  ['Aplicación', 'InfoManager System, módulo de Documentos con vencimientos'],
  ['Back end', 'Java 21, Spring Boot 3.3.5, Spring Data JPA con Hibernate, Tomcat integrado'],
  ['Front end', 'React (JSX) con Vite, Bootstrap 5.3 y CSS propio'],
  ['Base de datos', 'MySQL 8.x, base infomanager_db (tablas documentos, categorias_documento y usuarios)'],
  ['Herramientas', 'NetBeans, MySQL Workbench, Git y GitHub'],
  ['Dirección de la aplicación', 'http://localhost:8080/documentos.html'],
  ['Navegador de las pruebas', '[completar: navegador y versión]'],
  ['Fecha de ejecución', '[completar: fecha en que se ejecutaron las pruebas]']
];

export const historias = [
  { id: 'HU-D01', titulo: 'Subir un documento', prioridad: 'Alta',
    historia: 'Como usuario, quiero subir un documento con su archivo, su categoría y una fecha de vencimiento opcional, para tenerlo registrado en el sistema.',
    criterios: [
      'Título, categoría, usuario que lo sube y archivo son obligatorios.',
      'El título admite hasta 100 caracteres y la descripción hasta 255.',
      'El archivo debe ser pdf, doc, docx, xls, xlsx, ppt, pptx, txt, png, jpg o jpeg, no estar vacío y pesar máximo 10 MB.',
      'La fecha de vencimiento es opcional. El estado inicial es activo.',
      'Al terminar se muestra un aviso de éxito y el documento aparece en la lista.'] },
  { id: 'HU-D02', titulo: 'Consultar el listado de documentos', prioridad: 'Alta',
    historia: 'Como usuario, quiero ver el listado de documentos con su categoría, quién lo subió, la fecha, el vencimiento y el estado, para saber qué hay almacenado.',
    criterios: [
      'La tabla muestra documento, categoría, subido por, fecha, vence, estado y acciones.',
      'Los documentos más recientes aparecen primero.',
      'Si no hay documentos se informa con un mensaje.'] },
  { id: 'HU-D03', titulo: 'Buscar y filtrar documentos', prioridad: 'Media',
    historia: 'Como usuario, quiero buscar y filtrar documentos por título, categoría y vigencia, para encontrarlos rápidamente.',
    criterios: [
      'La búsqueda por título es parcial y no distingue mayúsculas de minúsculas.',
      'Los filtros de categoría, vigencia y texto se pueden combinar.',
      'Si ningún documento coincide se muestra un mensaje claro.'] },
  { id: 'HU-D04', titulo: 'Conocer la vigencia de un documento', prioridad: 'Alta',
    historia: 'Como administrador, quiero ver si un documento está vigente, por vencer o vencido, para actuar antes de que caduque.',
    criterios: [
      'La vigencia se calcula con la fecha actual; no se guarda en la base de datos.',
      'Por vencer: vence dentro de los próximos 30 días, incluido el día de hoy.',
      'Vencido: la fecha de vencimiento es anterior a hoy. Vigente: vence después de 30 días.',
      'Se indica cuántos días faltan o cuántos días lleva vencido. Sin fecha se muestra "Sin vencimiento".'] },
  { id: 'HU-D05', titulo: 'Ver el resumen de vencimientos en el panel', prioridad: 'Media',
    historia: 'Como administrador, quiero ver en el panel cuántos documentos están por vencer y cuántos vencidos, para tener una visión general.',
    criterios: [
      'El panel muestra la cantidad de documentos activos y de documentos por vencer.',
      'Se indica el número de documentos vencidos.',
      'Las cifras provienen de la base de datos y solo cuentan documentos activos.'] },
  { id: 'HU-D06', titulo: 'Modificar un documento', prioridad: 'Alta',
    historia: 'Como usuario, quiero modificar el título, la descripción, la categoría, el vencimiento y el estado de un documento, para mantener su información al día.',
    criterios: [
      'Se aplican las mismas validaciones que al subir.',
      'El documento puede archivarse y reactivarse.',
      'La fecha de vencimiento puede quitarse.',
      'El archivo no se reemplaza al editar.'] },
  { id: 'HU-D07', titulo: 'Descargar el archivo de un documento', prioridad: 'Media',
    historia: 'Como usuario, quiero descargar el archivo de un documento, para consultarlo.',
    criterios: [
      'El archivo se descarga con el título del documento como nombre y su extensión original.',
      'Si el archivo no existe se informa con un mensaje.'] },
  { id: 'HU-D08', titulo: 'Eliminar un documento', prioridad: 'Media',
    historia: 'Como administrador, quiero eliminar un documento, para retirar los que ya no se necesitan.',
    criterios: [
      'Pide confirmación antes de eliminar.',
      'Se borran el registro de la base de datos y el archivo guardado.',
      'Si el documento ya no existe se informa con un mensaje.'] }
];

export const casosDeUso = [
  ['CU-D01', 'Subir documento', 'Usuario, Administrador', 'Registra un documento con su archivo, categoría y vencimiento opcional. Valida los datos y guarda el archivo.', 'HU-D01'],
  ['CU-D02', 'Consultar documentos', 'Usuario, Administrador', 'Muestra la tabla de documentos con sus datos y su estado.', 'HU-D02'],
  ['CU-D03', 'Buscar y filtrar', 'Usuario, Administrador', 'Localiza documentos por título, categoría y vigencia.', 'HU-D03'],
  ['CU-D04', 'Consultar vigencia', 'Administrador', 'Calcula y muestra si el documento está vigente, por vencer o vencido.', 'HU-D04'],
  ['CU-D05', 'Ver resumen de vencimientos', 'Administrador', 'Muestra en el panel los totales de documentos activos, por vencer y vencidos.', 'HU-D05'],
  ['CU-D06', 'Modificar documento', 'Usuario, Administrador', 'Cambia los datos de un documento, incluido su estado y su vencimiento.', 'HU-D06'],
  ['CU-D07', 'Descargar archivo', 'Usuario, Administrador', 'Entrega el archivo guardado del documento.', 'HU-D07'],
  ['CU-D08', 'Eliminar documento', 'Administrador', 'Elimina el documento y su archivo previa confirmación.', 'HU-D08']
];

// ---------------------------------------------------------------------------
// Pruebas funcionales: una por requisito, con su pantallazo.
// ---------------------------------------------------------------------------
export const funcionales = [
  { hu: 'HU-D02', id: 'CP-05', titulo: 'Listado sin documentos',
    pasos: ['Con la base de datos sin documentos, abrir http://localhost:8080/documentos.html.'],
    datos: 'Ninguno.', esperado: 'La tabla aparece sin filas y se muestra el mensaje "No hay documentos para mostrar."' },
  { hu: 'HU-D01', id: 'CP-01', titulo: 'Abrir el formulario de subida',
    pasos: ['Pulsar el botón "Subir documento".'],
    datos: 'Ninguno.', esperado: 'Se abre el panel "Subir documento" con los campos Título, Descripción, Categoría, Subido por, Archivo y Fecha de vencimiento. Las listas de categoría y usuario traen datos de la base.' },
  { hu: 'HU-D01', id: 'CP-02', titulo: 'Subir un documento con todos los datos',
    pasos: ['Completar el formulario con los datos indicados.', 'Pulsar "Guardar documento".'],
    datos: 'Título: Contrato de prestación de servicios. Descripción: Contrato con el proveedor de internet. Categoría: Contratos. Subido por: el usuario de prueba. Archivo: contrato.pdf. Vencimiento: la fecha de hoy más 45 días.',
    esperado: 'Aviso "Documento subido correctamente." El documento aparece en la tabla con estado Activo y la insignia "Vigente".' },
  { hu: 'HU-D02', id: 'CP-06', titulo: 'Listado con varios documentos',
    pasos: ['Subir otros tres documentos con los datos de la guía de pruebas.', 'Observar la tabla.'],
    datos: 'Cuatro documentos de las categorías Contratos, Certificados, Actas e Informes.',
    esperado: 'La tabla muestra los cuatro documentos con categoría, quién lo subió, fecha, vencimiento y estado. El más reciente aparece primero.' },
  { hu: 'HU-D03', id: 'CP-07', titulo: 'Buscar por título',
    pasos: ['Escribir "acta" en el campo "Buscar documento".'],
    datos: 'Texto: acta.', esperado: 'La tabla se reduce a los documentos cuyo título contiene "acta", sin distinguir mayúsculas.' },
  { hu: 'HU-D03', id: 'CP-08', titulo: 'Filtrar por categoría',
    pasos: ['Limpiar la búsqueda.', 'Elegir "Contratos" en el filtro de categorías.'],
    datos: 'Categoría: Contratos.', esperado: 'Solo se muestran los documentos de la categoría Contratos.' },
  { hu: 'HU-D03', id: 'CP-09', titulo: 'Filtrar por vigencia',
    pasos: ['Restablecer el filtro de categorías.', 'Elegir "Por vencer" en el filtro de vigencia.'],
    datos: 'Vigencia: Por vencer.', esperado: 'Solo se muestran los documentos que vencen dentro de los próximos 30 días.' },
  { hu: 'HU-D03', id: 'CP-10', titulo: 'Búsqueda sin resultados',
    pasos: ['Restablecer los filtros.', 'Escribir "zzzz" en el campo de búsqueda.'],
    datos: 'Texto: zzzz.', esperado: 'Se muestra el mensaje "No hay documentos para mostrar."' },
  { hu: 'HU-D04', id: 'CP-11', titulo: 'Las cuatro situaciones de vigencia',
    pasos: ['Quitar todos los filtros.', 'Observar la columna "Vence" de los cuatro documentos.'],
    datos: 'Un documento vigente, uno que vence en 10 días, uno vencido ayer y uno sin fecha.',
    esperado: 'Se ven las insignias "Vigente", "Vence en 10 días", "Vencido hace 1 día" y el texto "Sin vencimiento".' },
  { hu: 'HU-D05', id: 'CP-12', titulo: 'Resumen de vencimientos en el panel',
    pasos: ['Abrir http://localhost:8080/dashboard.html.'],
    datos: 'Los cuatro documentos del listado.', esperado: 'El panel muestra 4 documentos activos, 1 documento por vencer en 30 días y "1 vencido".' },
  { hu: 'HU-D06', id: 'CP-13', titulo: 'Abrir un documento para editarlo',
    pasos: ['En la tabla, pulsar el icono del lápiz del documento "Informe trimestral".'],
    datos: 'Documento: Informe trimestral.', esperado: 'Se abre el panel "Editar documento" con los datos cargados. No aparece el campo de archivo y sí el campo Estado.' },
  { hu: 'HU-D06', id: 'CP-14', titulo: 'Guardar cambios y archivar',
    pasos: ['Cambiar la descripción a "Informe actualizado".', 'Cambiar el estado a Archivado.', 'Pulsar "Guardar cambios".'],
    datos: 'Descripción: Informe actualizado. Estado: Archivado.', esperado: 'Aviso "Documento actualizado correctamente." La fila muestra la nueva descripción y el estado Archivado.' },
  { hu: 'HU-D07', id: 'CP-15', titulo: 'Descargar el archivo',
    pasos: ['Pulsar el icono de descarga del documento "Contrato de prestación de servicios".', 'Abrir el archivo descargado.'],
    datos: 'Documento: Contrato de prestación de servicios.', esperado: 'El navegador descarga "Contrato de prestación de servicios.pdf" y el archivo abre con el contenido original.' },
  { hu: 'HU-D08', id: 'CP-16', titulo: 'Confirmación antes de eliminar',
    pasos: ['Pulsar el icono de la papelera de un documento.'],
    datos: 'Documento: Acta de comité.', esperado: 'El navegador pide confirmación: "¿Eliminar el documento ...? También se borrará su archivo."' },
  { hu: 'HU-D08', id: 'CP-17', titulo: 'Documento eliminado',
    pasos: ['Aceptar la confirmación.'],
    datos: 'Documento: Acta de comité.', esperado: 'Aviso "Documento eliminado." y la fila desaparece de la tabla.' },
  { hu: 'HU-D01', id: 'CP-03', titulo: 'Registros guardados en MySQL (Hibernate)',
    pasos: ['En MySQL Workbench ejecutar: SELECT id_documento, titulo, fecha_vencimiento, estado FROM documentos;'],
    datos: 'Consulta sobre la tabla documentos.', esperado: 'Aparecen los documentos subidos, con su fecha de vencimiento y estado (activo o archivado). El eliminado ya no está.' },
  { hu: 'HU-D01', id: 'CP-04', titulo: 'SQL generado por Hibernate',
    pasos: ['En la ventana Output de NetBeans, buscar las líneas "Hibernate: insert into documentos ..." y "Hibernate: select ...".'],
    datos: 'Consola de la aplicación Spring Boot.', esperado: 'La consola muestra las sentencias SQL que Hibernate generó al subir y consultar documentos.' }
];

// ---------------------------------------------------------------------------
// Pruebas de validación: agrupadas por tipo de dato.
// ---------------------------------------------------------------------------
export const validaciones = [
  { grupo: 'Campos obligatorios y longitudes', pruebas: [
    { id: 'CP-V01', titulo: 'Formulario vacío', datos: 'Abrir "Subir documento" y pulsar "Guardar documento" sin llenar nada.',
      esperado: 'Cuatro mensajes en rojo: "El título es obligatorio.", "Seleccione una categoría.", "Seleccione quién sube el documento." y "Seleccione el archivo." No se envía nada al servidor.' },
    { id: 'CP-V02', titulo: 'Título formado solo por espacios', datos: 'Título: tres espacios. Demás campos válidos.',
      esperado: 'Mensaje "El título es obligatorio."' },
    { id: 'CP-V03', titulo: 'Título de 100 caracteres (límite permitido)', datos: 'Título: una cadena de exactamente 100 letras A. Demás campos válidos.',
      esperado: 'El documento se guarda correctamente.' },
    { id: 'CP-V04', titulo: 'Título y descripción por encima del límite', datos: 'Pegar 120 caracteres en el título y 300 en la descripción.',
      esperado: 'Los campos solo aceptan 100 caracteres en el título y 255 en la descripción; el resto se descarta.' }
  ]},
  { grupo: 'Caracteres especiales', pruebas: [
    { id: 'CP-V05', titulo: 'Símbolos de HTML y comillas en el título', datos: 'Título: Informe <b>final</b> & "Q1" \'prueba\'',
      esperado: 'Se guarda y se muestra exactamente como se escribió, sin interpretar la etiqueta <b> como negrita.' },
    { id: 'CP-V06', titulo: 'Intento de inyectar código en el título', datos: 'Título: <script>alert(\'hola\')</script>',
      esperado: 'Se guarda y se muestra como texto. No aparece ninguna ventana de alerta.' },
    { id: 'CP-V07', titulo: 'Tildes y letra ñ', datos: 'Título: Señalización y ácido, año Ñandú.',
      esperado: 'Se guarda y se muestra con las tildes y la ñ correctas.' },
    { id: 'CP-V08', titulo: 'Búsqueda con comilla y sentencia SQL', datos: "Texto de búsqueda: '; DROP TABLE documentos; --",
      esperado: 'La búsqueda no produce error, no devuelve resultados y la tabla documentos sigue existiendo (se verifica en Workbench).' }
  ]},
  { grupo: 'Números e identificadores', pruebas: [
    { id: 'CP-V09', titulo: 'Identificador con letras', datos: 'Abrir en el navegador http://localhost:8080/api/documentos/abc',
      esperado: 'Respuesta de error 400 con el mensaje "Los datos enviados no son válidos. Revise los campos e inténtelo de nuevo."' },
    { id: 'CP-V10', titulo: 'Identificador inexistente', datos: 'Abrir en el navegador http://localhost:8080/api/documentos/99999',
      esperado: 'Respuesta de error 404 con el mensaje "El documento solicitado no existe."' },
    { id: 'CP-V11', titulo: 'Filtro de vigencia no válido', datos: 'Abrir en el navegador http://localhost:8080/api/documentos?vigencia=xyz',
      esperado: 'Respuesta de error 400 con el mensaje "El filtro de vigencia no es válido."' }
  ]},
  { grupo: 'Fechas', pruebas: [
    { id: 'CP-V12', titulo: 'Documento que vence hoy', datos: 'Editar un documento y poner como vencimiento la fecha de hoy.',
      esperado: 'La fila muestra la fecha de hoy con la insignia "Vence hoy".' },
    { id: 'CP-V13', titulo: 'Límite de los 30 días', datos: 'Un documento con vencimiento a 30 días y otro a 31 días, visibles a la vez.',
      esperado: 'El de 30 días muestra "Vence en 30 días" (por vencer) y el de 31 días muestra "Vigente".' },
    { id: 'CP-V14', titulo: 'Documento vencido ayer', datos: 'Vencimiento: la fecha de ayer.',
      esperado: 'La fila muestra la insignia roja "Vencido hace 1 día".' },
    { id: 'CP-V15', titulo: 'Fecha muy antigua', datos: 'Vencimiento: 01/01/1900.',
      esperado: 'Se guarda sin error y aparece como "Vencido hace" seguido de la cantidad de días transcurridos.' },
    { id: 'CP-V16', titulo: 'Quitar la fecha de vencimiento', datos: 'Editar un documento con vencimiento y dejar vacío el campo de fecha.',
      esperado: 'Aviso de actualización y la fila pasa a "Sin vencimiento".' },
    { id: 'CP-V17', titulo: 'Fecha inválida enviada directamente a la API', datos: 'Desde la consola del navegador (F12), enviar una modificación con fechaVencimiento 2026-13-45.',
      esperado: 'La API responde 400 con el mensaje "Los datos enviados no son válidos. Revise los campos e inténtelo de nuevo."' }
  ]},
  { grupo: 'Archivos', pruebas: [
    { id: 'CP-V18', titulo: 'Tipo de archivo no permitido', datos: 'Archivo: programa.exe. Demás campos válidos.',
      esperado: 'Mensaje "Tipo de archivo no permitido. Use pdf, doc, docx, xls, xlsx, ppt, pptx, txt, png, jpg o jpeg."' },
    { id: 'CP-V19', titulo: 'Archivo vacío', datos: 'Archivo de 0 bytes llamado vacio.pdf.',
      esperado: 'Mensaje "El archivo está vacío."' },
    { id: 'CP-V20', titulo: 'Archivo de más de 10 MB', datos: 'Archivo grande.pdf de 11 MB.',
      esperado: 'Mensaje "El archivo supera el tamaño máximo de 10 MB."' },
    { id: 'CP-V21', titulo: 'Nombre de archivo con espacios, tildes y paréntesis', datos: 'Archivo: Informe ñandú (final) 2026.pdf.',
      esperado: 'Se sube sin error y al descargarlo el archivo se llama como el título del documento.' }
  ]},
  { grupo: 'Validaciones del servidor (se saltan el formulario)', pruebas: [
    { id: 'CP-V22', titulo: 'Título de 101 caracteres enviado directamente a la API', datos: 'Desde la consola del navegador (F12), enviar una subida con un título de 101 caracteres.',
      esperado: 'La API responde 400 con el mensaje "El título no puede superar los 100 caracteres."' },
    { id: 'CP-V23', titulo: 'Archivo .exe enviado directamente a la API', datos: 'Desde la consola del navegador (F12), enviar una subida con un archivo virus.exe.',
      esperado: 'La API responde 400 con el mensaje "Tipo de archivo no permitido. Use pdf, doc, docx, xls, xlsx, ppt, pptx, txt, png, jpg o jpeg."' }
  ]}
];
