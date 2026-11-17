import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexto/AuthContext.jsx';

// Restaura el tema (claro u oscuro) elegido antes
try {
  if (localStorage.getItem('im-theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} catch (e) {
  // almacenamiento no disponible: se deja el tema claro
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* El proveedor de sesión envuelve toda la aplicación para que cualquier componente conozca al usuario */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
