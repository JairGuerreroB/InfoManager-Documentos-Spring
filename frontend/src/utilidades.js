// Funciones y constantes de apoyo de la pantalla de documentos.

export const TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB, igual que el límite del servidor
export const EXTENSIONES_PERMITIDAS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'png', 'jpg', 'jpeg'];

// Convierte 2026-12-31 (o 2026-12-31T10:00:00) en 31/12/2026 sin desfases de zona horaria.
export function formatearFecha(iso) {
  if (!iso) {
    return '—';
  }
  const [anio, mes, dia] = iso.substring(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

// Extensión en minúsculas, sin el punto ('' si el nombre no tiene extensión).
export function extensionDe(nombre) {
  const punto = nombre.lastIndexOf('.');
  return punto < 0 ? '' : nombre.substring(punto + 1).toLowerCase();
}

// Icono de Bootstrap Icons y color según el tipo de archivo.
export function iconoArchivo(extension) {
  const iconos = {
    pdf: ['bi-file-earmark-pdf', '#DC3545'],
    doc: ['bi-file-earmark-word', '#2E5C8A'],
    docx: ['bi-file-earmark-word', '#2E5C8A'],
    xls: ['bi-file-earmark-excel', '#1E7B34'],
    xlsx: ['bi-file-earmark-excel', '#1E7B34'],
    ppt: ['bi-file-earmark-ppt', '#C4501B'],
    pptx: ['bi-file-earmark-ppt', '#C4501B'],
    png: ['bi-file-earmark-image', '#6F42C1'],
    jpg: ['bi-file-earmark-image', '#6F42C1'],
    jpeg: ['bi-file-earmark-image', '#6F42C1']
  };
  const [clase, color] = iconos[extension] || ['bi-file-earmark-text', '#6C757D'];
  return { clase, color };
}
