-- InfoManager System - Módulo de documentos con vencimientos
-- Ejecutar DESPUÉS de 01_infomanager_system_script.sql y 02_datos_iniciales.sql

USE infomanager_db;

-- 1) Fecha de vencimiento (opcional) de cada documento.
--    Ejecutar UNA sola vez: si la columna ya existe, MySQL responde "Duplicate column name".
ALTER TABLE documentos
    ADD COLUMN fecha_vencimiento DATE NULL DEFAULT NULL AFTER fecha_subida,
    ADD INDEX idx_documentos_vencimiento (fecha_vencimiento);

-- 2) Categorías iniciales. INSERT IGNORE evita errores al repetir el script
--    (nombre_categoria es UNIQUE).
INSERT IGNORE INTO categorias_documento (nombre_categoria, descripcion) VALUES
    ('Contratos',    'Contratos de servicios, laborales y de proveedores'),
    ('Informes',     'Informes periódicos y reportes de gestión'),
    ('Certificados', 'Certificados, licencias y permisos con fecha de vigencia'),
    ('Actas',        'Actas de reuniones y comités');

SELECT id_categoria, nombre_categoria FROM categorias_documento;
DESCRIBE documentos;
