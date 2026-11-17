import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));

// Pantallas del prototipo que aún sirve Spring Boot: en desarrollo se reenvían al puerto 8080
const prototipos = '^/(usuarios|reportes|perfil|guia_estilos)\\.html$';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/assets/style.css': 'http://localhost:8080',
      [prototipos]: 'http://localhost:8080'
    }
  },
  build: {
    // El resultado se escribe dentro de Spring Boot: reemplaza static/index.html
    outDir: fileURLToPath(new URL('../src/main/resources/static', import.meta.url)),
    emptyOutDir: false, // no borrar las pantallas del prototipo
    rollupOptions: {
      input: raiz + 'index.html',
      output: { entryFileNames: 'assets/app-react.js' }
    }
  }
});
