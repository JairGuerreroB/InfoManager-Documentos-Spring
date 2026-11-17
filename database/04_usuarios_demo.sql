-- InfoManager System - Usuarios de demostración para iniciar sesión
-- Ejecutar DESPUÉS de 01, 02 y 03. Las contraseñas están cifradas con PBKDF2, igual que las de los módulos de usuarios.
--
--   Administrador:  admin@infomanager.local     contraseña: Admin2026*
--   Usuario:        usuario@infomanager.local   contraseña: Usuario2026*
--
-- Son cuentas de prueba para este proyecto formativo. INSERT IGNORE evita errores si el script se repite
-- (el correo es único).

USE infomanager_db;

INSERT IGNORE INTO usuarios (nombre, apellido, correo, contrasena, id_rol, estado)
SELECT 'Administrador', 'Demo', 'admin@infomanager.local', '65536:a5l4/LYCtxijssbLXRsZkA==:M8Uqtb8le2ms3TD70WItbnEPYaKvcWBjDXMj6JEYiMU=', id_rol, 'activo'
FROM roles WHERE nombre_rol = 'Administrador';

INSERT IGNORE INTO usuarios (nombre, apellido, correo, contrasena, id_rol, estado)
SELECT 'Usuario', 'Demo', 'usuario@infomanager.local', '65536:IhNdotBqAEGPh88szFrRCg==:W2vRdVTNKawlcF5rJXQd0RwUQ7ZFvlrJ0MzY/dFYt64=', id_rol, 'activo'
FROM roles WHERE nombre_rol = 'Usuario';

SELECT u.id_usuario, u.nombre, u.apellido, u.correo, r.nombre_rol, u.estado
FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol;
