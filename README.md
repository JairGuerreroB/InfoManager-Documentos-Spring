# InfoManager System — Documentos, sesión y panel (Spring Boot + Hibernate + React)

Parte del proyecto formativo **InfoManager System**: gestión de documentos con vencimientos, inicio de sesión por
roles y panel administrativo. El servidor está hecho con **Spring Boot e Hibernate** y la interfaz con **React (JSX)**.

- **GA7-220501096-AA3-EV01 y AA3-EV02:** módulo de documentos con vencimientos y su documento de pruebas.
- **GA7-220501096-AA4-EV03:** componente front-end del proyecto: aplicación React con navegación, inicio de sesión
  real, control de acceso por rol y panel con cifras de la base de datos.

Aprendiz: Jair Guerrero · Ficha 3336142 · Instructor: Juan Hernández.

## Frameworks aplicados

| Framework | Dónde se aplica |
|---|---|
| **Spring Boot / Spring MVC** | `@SpringBootApplication` inicia Tomcat integrado; `@RestController` expone la API; `@Service` contiene las reglas; inyección de dependencias por constructor; `@RestControllerAdvice` centraliza los errores |
| **React (JSX)** | Toda la interfaz está en la carpeta `frontend/`: componentes de función, Hooks (`useState`, `useEffect`, `useContext`, `useSyncExternalStore`) y Hooks propios (`useAuth`, `useAvisos`, `useRetraso`, `useTema`), un contexto de sesión, rutas protegidas por rol y un enrutador propio por hash. Se compila con Vite. Ver `frontend/README.md` |
| **Spring Data JPA** | Repositorios (`DocumentoRepositorio`, ...) sin escribir SQL para las operaciones básicas; consultas propias con `@Query` |
| **Hibernate (JPA)** | Entidades `Documento`, `CategoriaDocumento` y `Usuario` mapeadas a las tablas de MySQL con `@Entity`, `@Table`, `@Column`, `@ManyToOne(fetch = LAZY)`, `@EntityGraph`, `@Convert` (estado ENUM), `@PrePersist` e `@Immutable`. Con `spring.jpa.show-sql=true` la consola muestra el SQL que genera Hibernate |

Los diseños (HTML, CSS y Bootstrap 5) vienen del prototipo aprobado. En esta evidencia las pantallas de **inicio de sesión,
panel y documentos** se construyeron con React y consumen la API real; las de usuarios, reportes y perfil siguen siendo
el prototipo HTML hasta que se desarrolle su módulo.

## Funcionalidades

**Inicio de sesión y roles**
- Inicio de sesión que valida el correo y la contraseña contra la base de datos (contraseñas cifradas con PBKDF2).
- Dos roles: **Administrador** (panel, usuarios, documentos, reportes y perfil; puede eliminar documentos) y
  **Usuario** (documentos y perfil; puede subir, consultar, editar y descargar, pero no eliminar).
- Cada rol ve solo las opciones de menú que le corresponden; si entra a una dirección sin permiso, se le informa.
- La sesión se recuerda mientras la pestaña esté abierta y se cierra con "Cerrar sesión".

**Panel administrativo**
- Tarjetas con usuarios registrados, documentos activos, documentos por vencer en 30 días (y cuántos están vencidos)
  y documentos archivados.
- Próximos vencimientos, documentos vencidos y documentos activos por categoría.

**Documentos con vencimientos**
- Subir un documento con archivo (PDF, Word, Excel, PowerPoint, TXT, PNG, JPG; máximo 10 MB). Quien lo sube es el
  usuario con sesión iniciada.
- Consultar y filtrar por título, categoría y vigencia; modificar datos y estado (activo o archivado); descargar el
  archivo; eliminar (solo Administrador).
- **Vigencia calculada:** vigente, por vencer (próximos 30 días), vencido o sin vencimiento, con insignias de color.

## Requisitos

- JDK 17 o superior (Spring Boot 3.3)
- MySQL Server 8.x con la base `infomanager_db`
- NetBeans, IntelliJ IDEA o Eclipse con Maven (o Maven en la terminal). La primera vez descarga dependencias,
  así que necesita internet.

No hace falta instalar Tomcat: Spring Boot lo trae integrado.

## Puesta en marcha

1. **Base de datos.** En MySQL Workbench ejecute, en orden, los scripts de `database/`:
   `01_infomanager_system_script.sql`, `02_datos_iniciales.sql`, `03_documentos_vencimiento.sql` y
   `04_usuarios_demo.sql`. Si ya tenía ejecutados el 01, el 02 y el 03 de evidencias anteriores, ejecute solo el 04
   (crea dos usuarios de demostración; es seguro repetirlo).
2. **Contraseña.** En `src/main/resources/` copie `local.properties.example` como `local.properties` y escriba
   su contraseña de MySQL. Ese archivo no se sube a GitHub.
3. **Ejecutar.** Abra la carpeta del proyecto (la que tiene `pom.xml`) en su IDE. En NetBeans: clic derecho en
   `InfoManagerApplication.java` y **Run File**. Con Maven en la terminal: `mvn spring-boot:run`.
   Debe aparecer en consola `Started InfoManagerApplication`.
4. **Abrir** http://localhost:8080/ e iniciar sesión con una de las cuentas de la sección siguiente.

Para detener la aplicación, use el botón de parar del IDE o `Ctrl + C` en la terminal.

> Abra siempre la aplicación desde `http://localhost:8080/`. Si abre el HTML con doble clic, el navegador
> no puede llegar a la API.

## Usuarios para probar

El script `04_usuarios_demo.sql` crea dos cuentas de demostración:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@infomanager.local` | `Admin2026*` |
| Usuario | `usuario@infomanager.local` | `Usuario2026*` |

También sirven los usuarios creados con los módulos de las evidencias anteriores (GA7-220501096-AA2-EV01 y AA2-EV02),
con la contraseña que se les haya puesto. Si uno de ellos debe ser administrador, en Workbench:

```sql
UPDATE usuarios SET id_rol = (SELECT id_rol FROM roles WHERE nombre_rol = 'Administrador')
WHERE correo = 'su_correo@ejemplo.com';
```

Las cuentas de demostración son solo para este proyecto formativo.

### Desarrollo del front end (React)

La pantalla de documentos ya viene compilada dentro de `src/main/resources/static`, así que **no hace falta Node**
para ejecutarla. Para ver o modificar el código React:

```
cd frontend
npm install        (solo la primera vez)
npm run dev        (abre http://localhost:5173/documentos.html con Spring Boot en ejecución)
npm run build      (genera de nuevo la versión que sirve Spring Boot)
```

## API REST

| Método y ruta | Descripción |
|---|---|
| `POST /api/auth/login` | Valida `{correo, contrasena}` y devuelve el usuario con su rol (401 si las credenciales no son correctas) |
| `GET /api/documentos?texto=&idCategoria=&vigencia=` | Lista con filtros opcionales (`vigente`, `por_vencer`, `vencido`, `sin_vencimiento`) |
| `GET /api/documentos/resumen` | Totales: activos, archivados, por vencer y vencidos |
| `GET /api/documentos/{id}` | Consulta un documento |
| `POST /api/documentos` | Sube un documento (`multipart/form-data`: titulo, descripcion, idCategoria, idUsuario, fechaVencimiento, archivo) |
| `PUT /api/documentos/{id}` | Modifica los datos (JSON) |
| `DELETE /api/documentos/{id}` | Elimina el documento y su archivo |
| `GET /api/documentos/{id}/archivo` | Descarga el archivo |
| `GET /api/categorias`, `GET /api/usuarios` | Listas para los campos desplegables |

Los errores se devuelven como `{"mensaje": "..."}` con el código HTTP correspondiente (400, 404, 413 o 500).

## Pruebas

**Automáticas:** `VigenciaTest` verifica la regla de vencimientos (`mvn test`).

**Manuales sugeridas para la AA4-EV03** (con los scripts 01 a 04 ejecutados):
1. Abrir http://localhost:8080/ sin sesión → lleva al inicio de sesión.
2. Intentar ingresar con los campos vacíos, con un correo mal escrito y con una contraseña incorrecta → se muestran los
   mensajes de error.
3. Ingresar como **Administrador** → llega al panel; el menú muestra Panel, Usuarios, Documentos, Reportes y Perfil.
4. Revisar las tarjetas del panel y compararlas con `SELECT * FROM documentos;` en Workbench.
5. Subir documentos con distintos vencimientos y volver al panel: las cifras y las listas cambian.
6. Cerrar sesión e ingresar como **Usuario** → llega a Documentos; el menú solo muestra Documentos y Perfil; no aparece
   el botón de eliminar.
7. Con la sesión de Usuario, escribir en la barra de direcciones `#/panel` → se muestra "Acceso restringido".
8. Cerrar sesión y escribir `#/documentos` → vuelve al inicio de sesión.
9. Recargar la página con la sesión abierta → la sesión se conserva.

## Estructura

```
InfoManager-Documentos-Spring/
├── pom.xml
├── database/            Scripts SQL (01 a 04)
├── docs/                Artefactos del proyecto y pruebas (docs/pruebas genera el documento de la AA3-EV02)
├── frontend/            Aplicación React (JSX) con Vite: ver frontend/README.md
└── src/
    ├── main/java/co/edu/sena/infomanager/
    │   ├── InfoManagerApplication.java
    │   ├── controlador/    DocumentoControlador, CatalogoControlador, AutenticacionControlador
    │   ├── servicio/       DocumentoServicio, CatalogoServicio, AutenticacionServicio
    │   ├── repositorio/    Repositorios de Spring Data JPA
    │   ├── modelo/         Entidades de Hibernate (Documento, Usuario, Rol...), EstadoDocumento, Vigencia
    │   ├── dto/            Objetos de entrada y salida de la API
    │   ├── almacenamiento/ AlmacenArchivos (guarda los archivos en disco)
    │   ├── util/           ContrasenaUtil (PBKDF2)
    │   └── excepcion/      Excepciones propias y ManejadorErrores
    ├── main/resources/
    │   ├── application.properties
    │   ├── local.properties.example
    │   └── static/         index.html y la aplicación React compilada, más los prototipos de usuarios, reportes y perfil
    └── test/java/          Pruebas unitarias
```

## Alcance y pendientes

- El **inicio de sesión valida las credenciales en el servidor**, pero la API todavía no entrega un token ni protege
  cada ruta: la pantalla solo muestra lo que corresponde al rol. La protección real de la API (Spring Security) está
  prevista para una etapa posterior.
- Usuarios, reportes y perfil aún son prototipos HTML; sus módulos se construirán en próximas evidencias.
- Siguientes mejoras previstas: flujo de aprobación de documentos, historial de versiones y registro de actividad.
