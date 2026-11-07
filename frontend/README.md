# Front end de Documentos (React + JSX)

Pantalla de gestión de documentos de InfoManager System construida con **React** y compilada con **Vite**.
Consume la API REST de Spring Boot (`/api/documentos`, `/api/categorias`, `/api/usuarios`).

## Desarrollo

1. Inicie la aplicación Spring Boot (puerto 8080).
2. En esta carpeta: `npm install` (solo la primera vez) y luego `npm run dev`.
3. Abra http://localhost:5173/documentos.html. Los cambios en el código se ven al guardar.

## Generar la versión final

`npm run build` compila la aplicación y reemplaza `../src/main/resources/static/documentos.html` junto con
`static/assets/documentos-react.js`. Después de compilar, Spring Boot sirve la pantalla en
http://localhost:8080/documentos.html sin necesidad de Node.

## Estructura de `src/`

| Archivo | Función |
|---|---|
| `main.jsx` | Punto de entrada: monta React en la página |
| `PaginaDocumentos.jsx` | Componente principal: estado, carga de datos y acciones |
| `componentes/Estructura.jsx` | Menú lateral y barra superior |
| `componentes/FiltrosDocumentos.jsx` | Búsqueda por título, categoría y vigencia |
| `componentes/TablaDocumentos.jsx` | Tabla y filas de documentos |
| `componentes/Vencimiento.jsx` | Fecha e insignia de vigencia (vigente, por vencer, vencido) |
| `componentes/ModalDocumento.jsx` | Formulario para subir y editar, con validaciones |
| `componentes/PilaAvisos.jsx` | Mensajes emergentes |
| `ganchos/` | Hooks propios: `useAvisos` y `useRetraso` |
| `api.js`, `utilidades.js` | Llamadas a la API y funciones de apoyo |
