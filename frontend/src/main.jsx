import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PaginaDocumentos from './PaginaDocumentos.jsx';

// Restaura el tema (claro u oscuro) elegido en las demás pantallas
try {
  if (localStorage.getItem('im-theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} catch (e) {
  // almacenamiento no disponible: se deja el tema claro
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaginaDocumentos />
  </StrictMode>
);
