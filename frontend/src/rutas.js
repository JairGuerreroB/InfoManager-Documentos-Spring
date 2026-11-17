// Roles y rutas de la aplicación: un solo lugar para decidir qué puede ver cada rol.

export const ADMINISTRADOR = 'Administrador';
export const USUARIO = 'Usuario';

// Opciones del menú lateral. Cada una indica qué roles pueden verla.
export const MENU = [
  { ruta: '/panel', texto: 'Panel', icono: 'bi-house-door', roles: [ADMINISTRADOR] },
  { ruta: '/usuarios', texto: 'Usuarios', icono: 'bi-people', roles: [ADMINISTRADOR] },
  { ruta: '/documentos', texto: 'Documentos', icono: 'bi-file-earmark-text', roles: [ADMINISTRADOR, USUARIO] },
  { ruta: '/reportes', texto: 'Reportes', icono: 'bi-bar-chart', roles: [ADMINISTRADOR] },
  { ruta: '/perfil', texto: 'Perfil', icono: 'bi-person-circle', roles: [ADMINISTRADOR, USUARIO] }
];

// Pantalla a la que llega cada rol después de iniciar sesión
export function rutaInicial(rol) {
  return rol === ADMINISTRADOR ? '/panel' : '/documentos';
}
