// Llamadas a la API REST de Spring Boot. Todas devuelven una promesa; si el servidor responde
// con error, se lanza una excepción con el mensaje que envió el servidor.

const API = '/api';

async function pedir(ruta, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(API + ruta, opciones);
  } catch (e) {
    throw new Error('No se pudo conectar con el servidor. Verifique que la aplicación esté en ejecución.');
  }
  if (!respuesta.ok) {
    let mensaje = `Ocurrió un error inesperado (${respuesta.status}).`;
    try {
      const cuerpo = await respuesta.json();
      if (cuerpo && cuerpo.mensaje) {
        mensaje = cuerpo.mensaje;
      }
    } catch (e) {
      // la respuesta no trae JSON
    }
    throw new Error(mensaje);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}

// ---- Sesión ----

// Valida el correo y la contraseña; devuelve { idUsuario, nombre, apellido, correo, rol }.
export const iniciarSesion = (correo, contrasena) =>
  pedir('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena })
  });

// ---- Documentos ----

// Lista documentos; los filtros vacíos no se envían.
export function listarDocumentos({ texto, idCategoria, vigencia } = {}) {
  const parametros = new URLSearchParams();
  if (texto && texto.trim()) parametros.set('texto', texto.trim());
  if (idCategoria) parametros.set('idCategoria', idCategoria);
  if (vigencia) parametros.set('vigencia', vigencia);
  return pedir('/documentos?' + parametros.toString());
}

// Totales del panel: total, activos, archivados, por vencer y vencidos.
export const obtenerResumen = () => pedir('/documentos/resumen');

export const listarCategorias = () => pedir('/categorias');
export const listarUsuarios = () => pedir('/usuarios');

// Subida de archivo: se envía como multipart/form-data (el navegador pone el encabezado).
export const subirDocumento = (formData) => pedir('/documentos', { method: 'POST', body: formData });

// Edición: solo cambian los datos, se envían como JSON.
export const actualizarDocumento = (id, datos) =>
  pedir(`/documentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

export const eliminarDocumento = (id) => pedir(`/documentos/${id}`, { method: 'DELETE' });

// Dirección desde la que se descarga el archivo de un documento.
export const urlArchivo = (id) => `${API}/documentos/${id}/archivo`;
