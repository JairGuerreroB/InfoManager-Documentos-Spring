# InfoManager System — Módulo de Documentos (Spring Boot + Hibernate)

Módulo de **gestión de documentos con vencimientos** de InfoManager System. Cada documento se sube con su
archivo, se clasifica por categoría y puede tener una fecha de vencimiento; el sistema calcula si está
**vigente, por vencer o vencido** y lo muestra en la pantalla de documentos y en el panel administrativo.

Evidencia **GA7-220501096-AA3-EV01** — Codificación de módulos del software stand-alone, web y móvil.
Aprendiz: Jair Guerrero · Ficha 3336142 · Instructor: Juan Hernández.

## Frameworks aplicados

| Framework | Dónde se aplica |
|---|---|
| **Spring Boot / Spring MVC** | `@SpringBootApplication` inicia Tomcat integrado; `@RestController` expone la API; `@Service` contiene las reglas; inyección de dependencias por constructor; `@RestControllerAdvice` centraliza los errores |
| **Spring Data JPA** | Repositorios (`DocumentoRepositorio`, ...) sin escribir SQL para las operaciones básicas; consultas propias con `@Query` |
| **Hibernate (JPA)** | Entidades `Documento`, `CategoriaDocumento` y `Usuario` mapeadas a las tablas de MySQL con `@Entity`, `@Table`, `@Column`, `@ManyToOne(fetch = LAZY)`, `@EntityGraph`, `@Convert` (estado ENUM), `@PrePersist` e `@Immutable`. Con `spring.jpa.show-sql=true` la consola muestra el SQL que genera Hibernate |

El front end (HTML, CSS, JavaScript y Bootstrap 5) ya existía como prototipo; en este módulo la pantalla
**Documentos** y el **Panel** quedan conectados a la API real. Las demás pantallas siguen con datos de ejemplo
hasta que se desarrolle su módulo.

## Funcionalidades

- Subir un documento con archivo (PDF, Word, Excel, PowerPoint, TXT, PNG, JPG; máximo 10 MB).
- Consultar y filtrar por título, categoría y vigencia.
- Modificar título, descripción, categoría, vencimiento y estado (activo o archivado).
- Eliminar un documento (también se borra el archivo).
- Descargar el archivo.
- **Vencimientos:** vigencia calculada (vigente, por vencer en los próximos 30 días, vencido o sin vencimiento),
  insignias de color en la tabla y tarjeta "Documentos por vencer" en el panel.

## Requisitos

- JDK 17 o superior (Spring Boot 3.3)
- MySQL Server 8.x con la base `infomanager_db`
- NetBeans, IntelliJ IDEA o Eclipse con Maven (o Maven en la terminal). La primera vez descarga dependencias,
  así que necesita internet.

No hace falta instalar Tomcat: Spring Boot lo trae integrado.

## Puesta en marcha

1. **Base de datos.** En MySQL Workbench ejecute, en orden, los scripts de `database/`:
   `01_infomanager_system_script.sql`, `02_datos_iniciales.sql` y `03_documentos_vencimiento.sql`.
   Si ya tenía las dos primeras ejecutadas de las evidencias anteriores, ejecute solo la 03 y una sola vez
   (agrega la columna de vencimiento y las categorías iniciales).
2. **Contraseña.** En `src/main/resources/` copie `local.properties.example` como `local.properties` y escriba
   su contraseña de MySQL. Ese archivo no se sube a GitHub.
3. **Ejecutar.** Abra la carpeta del proyecto (la que tiene `pom.xml`) en su IDE. En NetBeans: clic derecho en
   `InfoManagerApplication.java` y **Run File**. Con Maven en la terminal: `mvn spring-boot:run`.
   Debe aparecer en consola `Started InfoManagerApplication`.
4. **Abrir** http://localhost:8080/documentos.html (el panel está en `/dashboard.html`).

Para detener la aplicación, use el botón de parar del IDE o `Ctrl + C` en la terminal.

> Abra siempre las pantallas desde `http://localhost:8080/`. Si abre el HTML con doble clic, el navegador
> no puede llegar a la API.

## Antes de probar: aviso para quien evalúe el módulo

El proyecto se entrega **sin documentos cargados**, a propósito, para que usted pueda subir los suyos desde cero.

Hay un requisito previo: el campo **"Subido por"** del formulario se llena con la tabla `usuarios`. Si la base de
datos no tiene ningún usuario, la lista mostrará "No hay usuarios registrados" y no se podrá subir ningún
documento. Antes de la primera prueba debe existir al menos un usuario, de cualquiera de estas formas:

1. Registrarlo con los módulos de usuarios de las evidencias anteriores (GA7-220501096-AA2-EV01 con JDBC o
   GA7-220501096-AA2-EV02 con servlets y JSP), que usan la misma base de datos.
2. Crear uno de prueba en MySQL Workbench, ejecutando **una sola vez** esto (requiere haber corrido antes el
   script `02_datos_iniciales.sql`, que crea los roles):

```sql
USE infomanager_db;
INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
VALUES ('Usuario', 'De Prueba', 'prueba@infomanager.local', 'SIN_INICIO_DE_SESION', 1);
```

El usuario del paso 2 sirve únicamente para probar este módulo: su contraseña no es válida, así que no puede
iniciar sesión.

Esto ocurre porque el módulo todavía no tiene autenticación. Cuando exista el inicio de sesión, quien sube el
documento se tomará del usuario autenticado y esta lista desaparecerá.

## API REST

| Método y ruta | Descripción |
|---|---|
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

**Manuales sugeridas** (con al menos un usuario en la base, ver el aviso anterior):
1. Subir un documento sin vencimiento → aparece como "Sin vencimiento".
2. Subir uno con vencimiento a 10 días → "Vence en 10 días"; el panel suma uno en "por vencer".
3. Subir uno con fecha pasada → "Vencido hace N días".
4. Filtrar por categoría, por vigencia y por texto del título.
5. Editar un documento (cambiar fecha y estado a archivado) y comprobar que se actualiza.
6. Descargar el archivo y comprobar que abre.
7. Intentar subir un archivo de tipo no permitido o sin título → se muestra el error.
8. Eliminar un documento y verificar que desaparece de la tabla y de la carpeta `almacen/`.
9. En Workbench: `SELECT * FROM documentos;` para ver los registros.

## Estructura

```
InfoManager-Documentos-Spring/
├── pom.xml
├── database/            Scripts SQL (01, 02 y 03)
├── docs/                Artefactos del proyecto (diagramas y documento)
└── src/
    ├── main/java/co/edu/sena/infomanager/
    │   ├── InfoManagerApplication.java
    │   ├── controlador/    DocumentoControlador, CatalogoControlador
    │   ├── servicio/       DocumentoServicio, CatalogoServicio
    │   ├── repositorio/    Repositorios de Spring Data JPA
    │   ├── modelo/         Entidades de Hibernate, EstadoDocumento, Vigencia
    │   ├── dto/            Objetos de entrada y salida de la API
    │   ├── almacenamiento/ AlmacenArchivos (guarda los archivos en disco)
    │   └── excepcion/      Excepciones propias y ManejadorErrores
    ├── main/resources/
    │   ├── application.properties
    │   ├── local.properties.example
    │   └── static/         Front end (HTML, CSS, JavaScript y Bootstrap)
    └── test/java/          Pruebas unitarias
```

## Alcance y pendientes

- Este módulo todavía **no tiene autenticación**: cualquiera que abra la aplicación puede usar la API. El inicio
  de sesión con roles (Administrador y Usuario) llegará con el módulo de seguridad.
- Por eso la pantalla pide elegir quién sube el documento; cuando exista la sesión, se tomará del usuario
  autenticado.
- Siguientes mejoras previstas: flujo de aprobación, historial de versiones y registro de actividad.
