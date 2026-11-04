-- InfoManager System - Datos iniciales para el módulo de usuarios
-- Ejecutar DESPUÉS de 01_infomanager_system_script.sql
--
-- La tabla usuarios exige un rol (llave foránea), por eso los roles deben existir
-- antes de registrar el primer usuario. INSERT IGNORE evita errores si se ejecuta dos veces
-- (nombre_rol es UNIQUE).

USE infomanager_db;

INSERT IGNORE INTO roles (nombre_rol, descripcion) VALUES
    ('Administrador', 'Acceso total al sistema'),
    ('Usuario', 'Acceso limitado de consulta y gestión básica');

SELECT id_rol, nombre_rol, descripcion FROM roles;
