import { useEffect, useState } from 'react';

// Devuelve el valor recibido, pero solo después de que deja de cambiar durante 'milisegundos'.
// Se usa en la búsqueda para no consultar el servidor con cada tecla.
export function useRetraso(valor, milisegundos) {
  const [valorRetrasado, setValorRetrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorRetrasado(valor), milisegundos);
    return () => clearTimeout(temporizador);
  }, [valor, milisegundos]);

  return valorRetrasado;
}
