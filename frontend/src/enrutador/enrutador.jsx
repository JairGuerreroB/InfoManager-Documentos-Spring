import { useEffect, useSyncExternalStore } from 'react';

// Enrutador mínimo basado en el hash de la dirección (#/panel, #/documentos...).
// Cambiar de pantalla no recarga la página ni necesita configuración en el servidor.

// Ruta actual a partir del hash: "#/panel" -> "/panel"
function leerRuta() {
  const ruta = window.location.hash.replace(/^#/, '');
  return ruta === '' ? '/' : ruta;
}

// useSyncExternalStore avisa a React cada vez que cambia el hash
function suscribir(avisar) {
  window.addEventListener('hashchange', avisar);
  return () => window.removeEventListener('hashchange', avisar);
}

/** Hook que devuelve la ruta actual y vuelve a dibujar el componente cuando cambia. */
export function useRuta() {
  return useSyncExternalStore(suscribir, leerRuta);
}

/** Cambia de pantalla. Con reemplazar = true no deja la ruta anterior en el historial del navegador. */
export function navegar(ruta, { reemplazar = false } = {}) {
  if (reemplazar) {
    window.location.replace('#' + ruta);
  } else {
    window.location.hash = ruta;
  }
}

/** Enlace interno: equivale a un <a> que cambia de ruta sin recargar la página. */
export function Enlace({ a, children, ...resto }) {
  return <a href={'#' + a} {...resto}>{children}</a>;
}

/** Componente que redirige a otra ruta en cuanto se dibuja. */
export function Redirigir({ a }) {
  useEffect(() => {
    navegar(a, { reemplazar: true });
  }, [a]);
  return null;
}
