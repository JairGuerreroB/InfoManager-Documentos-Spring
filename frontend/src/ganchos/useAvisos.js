import { useCallback, useState } from 'react';

// Hook para mensajes emergentes: devuelve la lista de avisos y una función para agregar uno.
// Cada aviso desaparece solo a los pocos segundos.
export function useAvisos() {
  const [avisos, setAvisos] = useState([]);

  const avisar = useCallback((mensaje, tipo = 'ok') => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
    }, 3500);
  }, []);

  return { avisos, avisar };
}
