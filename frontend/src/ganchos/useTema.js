import { useCallback, useState } from 'react';

// Aplica el tema al documento y lo recuerda para la próxima visita
function aplicarTema(oscuro) {
  if (oscuro) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('im-theme', oscuro ? 'dark' : 'light');
  } catch (e) {
    // almacenamiento no disponible
  }
}

/** Hook del tema claro/oscuro: devuelve si está activo el oscuro y una función para alternarlo. */
export function useTema() {
  const [oscuro, setOscuro] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  const alternarTema = useCallback(() => {
    const nuevo = !oscuro;
    aplicarTema(nuevo);
    setOscuro(nuevo);
  }, [oscuro]);

  return { oscuro, alternarTema };
}
