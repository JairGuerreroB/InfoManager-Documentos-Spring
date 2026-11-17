# Front end de InfoManager System (React + JSX)

Aplicación de una sola página hecha con **React** y compilada con **Vite**. Consume la API REST de Spring Boot.
Incluye inicio de sesión, control de acceso por rol, panel administrativo y gestión de documentos.

## Desarrollo

1. Inicie la aplicación Spring Boot (puerto 8080).
2. En esta carpeta: `npm install` (solo la primera vez) y luego `npm run dev`.
3. Abra http://localhost:5173/. Los cambios en el código se ven al guardar.

## Generar la versión final

`npm run build` compila la aplicación y reemplaza `../src/main/resources/static/index.html` y
`static/assets/app-react.js`. Después de compilar, Spring Boot sirve la aplicación en http://localhost:8080/ sin
necesidad de Node. La versión compilada ya viene incluida en el proyecto.

## Cómo está organizada

| Carpeta o archivo | Función |
|---|---|
| `src/main.jsx` | Punto de entrada: monta React y el proveedor de sesión |
| `src/App.jsx` | Componente raíz: decide qué pantalla mostrar según la ruta y la sesión |
| `src/rutas.js` | Roles, opciones del menú y pantalla inicial de cada rol |
| `src/enrutador/enrutador.jsx` | Enrutador por hash (`#/panel`): `useRuta`, `navegar`, `Enlace` y `Redirigir` |
| `src/contexto/AuthContext.jsx` | Contexto de sesión: `AuthProvider` y el Hook `useAuth` |
| `src/paginas/` | Una pantalla por archivo: login, panel, documentos, en construcción y no encontrada |
| `src/componentes/` | Piezas reutilizables: estructura, ruta protegida, tarjetas, tabla, filtros, formulario y avisos |
| `src/ganchos/` | Hooks propios: `useAvisos`, `useRetraso` y `useTema` |
| `src/api.js` | Llamadas a la API REST |
| `src/utilidades.js` | Funciones de apoyo (fechas, iconos, extensiones) |

## Conceptos de React aplicados

- **Componentes de función y props:** cada pieza de la interfaz es una función que recibe sus datos por props.
- **Estado y efectos:** `useState` y `useEffect` en las páginas para guardar datos y cargarlos de la API.
- **Contexto:** `AuthContext` comparte la sesión con toda la aplicación sin pasarla por props.
- **Hooks propios:** lógica reutilizable empaquetada en `useAuth`, `useAvisos`, `useRetraso` y `useTema`.
- **Eventos:** `onChange`, `onSubmit` y `onClick` con `preventDefault`, y oyentes nativos dentro de `useEffect`.
- **Renderizado condicional y listas:** el menú y los botones cambian según el rol; las tablas se dibujan con `map` y `key`.
- **Rutas protegidas:** `RutaProtegida` redirige al login o muestra "Acceso restringido" según la sesión y el rol.
- **Enrutador propio:** usa `useSyncExternalStore` para reaccionar a los cambios del hash de la dirección.
