import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));

// Páginas del prototipo que sirve Spring Boot: en desarrollo se reenvían al puerto 8080
// para que el menú lateral siga funcionando desde http://localhost:5173
const paginasEstaticas = '^/(dashboard|usuarios|reportes|perfil|login|guia_estilos)\\.html$';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/assets/style.css': 'http://localhost:8080',
      [paginasEstaticas]: 'http://localhost:8080'
    }
  },
  build: {
    // El resultado se escribe dentro de Spring Boot: reemplaza static/documentos.html
    outDir: fileURLToPath(new URL('../src/main/resources/static', import.meta.url)),
    emptyOutDir: false, // no borrar las demás pantallas del prototipo
    rollupOptions: {
      input: raiz + 'documentos.html',
      output: { entryFileNames: 'assets/documentos-react.js' }
    }
  }
});
