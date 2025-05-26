/*  Script
    integrantes:
    • Dayson Santiago Guerrero Rodriguez
    • Estefany Dayana Vela Rangel
    • Stevenson Jorkaed Arias Sanabria
    • Michael Enrique Vejar Jimenez
*/
-- Borrar, si existe la base de datos
DROP DATABASE IF EXISTS ymdb;

-- Crear la base de datos y conectarse
CREATE DATABASE ymdb;
\c ymdb

-- Tabla de estados generales (activo, inactivo, etc.)
CREATE TABLE estado (
    idestado SERIAL PRIMARY KEY,
    descripcion_estado VARCHAR(12) NOT NULL
);

-- Inserción de registros a la tabla estados
INSERT INTO estado (descripcion_estado) VALUES 
    ('Activo'), 
    ('Inactivo');

-- Tipos de usuarios
CREATE TABLE tipo_usuario (
    idtipousuario SERIAL PRIMARY KEY,
    descripcion_tipo VARCHAR(15) NOT NULL
);

-- Inserción de registros a la tabla tipos de usuario
INSERT INTO tipo_usuario (descripcion_tipo) VALUES 
    ('Administrador'), 
    ('Empleado'), 
    ('Cliente');

-- Tabla de usuarios
CREATE TABLE usuarios (
    idusuario SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(8) DEFAULT NULL CHECK (telefono ~ '^[0-9]{7,8}$'),
    celular VARCHAR(10) DEFAULT NULL CHECK (celular ~ '^[0-9]{10}$'),
    imagen_perfil VARCHAR(255) DEFAULT NULL,
    idtipousuario INTEGER DEFAULT 3,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idtipousuario) REFERENCES tipo_usuario (idtipousuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Departamentos y municipios normalizados
CREATE TABLE departamentos (
    iddepartamento SERIAL PRIMARY KEY,
    nombre_departamento VARCHAR(50) NOT NULL UNIQUE
);

-- Inserción de registros a la tabla departamentos
INSERT INTO departamentos (nombre_departamento) VALUES
    ('Antioquia'),
    ('Cundinamarca'),
    ('Valle del Cauca'),
    ('Atlántico'),
    ('Santander');

CREATE TABLE municipios (
    idmunicipio SERIAL PRIMARY KEY,
    iddepartamento INTEGER NOT NULL,
    nombre_municipio VARCHAR(50) NOT NULL,
    FOREIGN KEY (iddepartamento) REFERENCES departamentos (iddepartamento) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Inserción de registros a la tabla municipios
INSERT INTO municipios (iddepartamento, nombre_municipio) VALUES
    (1, 'Medellín'),
    (1, 'Bello'),
    (2, 'Bogotá'),
    (2, 'Soacha'),
    (3, 'Cali'),
    (3, 'Palmira'),
    (4, 'Barranquilla'),
    (4, 'Soledad'),
    (5, 'Bucaramanga'),
    (5, 'Floridablanca');

-- Direcciones de usuarios
CREATE TABLE direcciones (
    iddireccion SERIAL PRIMARY KEY,
    idusuario INTEGER NOT NULL,
    idmunicipio INTEGER NOT NULL,
    direccion TEXT NOT NULL,
    codpostal VARCHAR(6) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios (idusuario) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (idmunicipio) REFERENCES municipios (idmunicipio) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Categorías y subcategorías
CREATE TABLE categorias (
    idcategoria SERIAL PRIMARY KEY,
    descripcion_categoria VARCHAR(30) NOT NULL,
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Inserción de registros a la tabla categorías
INSERT INTO categorias (descripcion_categoria) VALUES
    ('Deportiva'),
    ('Casual'),
    ('Formal');

CREATE TABLE subcategorias (
    idsubcategoria SERIAL PRIMARY KEY,
    idcategoria INTEGER NOT NULL,
    descripcion_subcategoria VARCHAR(30) NOT NULL,
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idcategoria) REFERENCES categorias (idcategoria) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Inserción de registros a la tabla subcategorías
INSERT INTO subcategorias (idcategoria, descripcion_subcategoria) VALUES
    (1, 'Ropa de gimnasio'),
    (1, 'Ropa deportiva exterior'),
    (1, 'Ropa térmica'),
    (2, 'Jeans'),
    (2, 'Camisetas'),
    (2, 'Faldas'),
    (3, 'Trajes'),
    (3, 'Blusas elegantes'),
    (3, 'Vestidos formales');

-- Productos
CREATE TABLE productos (
    idproducto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    idsubcategoria INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idsubcategoria) REFERENCES subcategorias (idsubcategoria) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tallas y colores
CREATE TABLE tallas (
    idtalla SERIAL PRIMARY KEY,
    descripcion_talla VARCHAR(3) NOT NULL,
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Inserción de registros a la tabla tallas
INSERT INTO tallas (descripcion_talla) VALUES
    ('XS'),    
    ('S'),
    ('M'),
    ('L'),
    ('XL'),
    ('XXL');

CREATE TABLE colores (
    idcolor SERIAL PRIMARY KEY,
    descripcion_color CHAR(7) NOT NULL CHECK (descripcion_color ~ '^#[A-Fa-f0-9]{6}$'),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Inserción de registros a la tabla colores
INSERT INTO colores (descripcion_color) VALUES
    ('#000000'),
    ('#FFFFFF'),
    ('#FF5733');

-- Inventario
CREATE TABLE inventario (
    idinventario SERIAL PRIMARY KEY,
    idproducto INTEGER NOT NULL,
    idtalla INTEGER NOT NULL,
    idcolor INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idproducto) REFERENCES productos (idproducto) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idtalla) REFERENCES tallas (idtalla) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idcolor) REFERENCES colores (idcolor) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Imágenes de productos
CREATE TABLE imagenes_producto (
    idimagen SERIAL PRIMARY KEY,
    idinventario INTEGER NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (idinventario) REFERENCES inventario (idinventario) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Bolsas (carritos)
CREATE TABLE bolsas (
    idbolsa SERIAL PRIMARY KEY,
    idusuario INTEGER NOT NULL,
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios (idusuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Productos en bolsas
CREATE TABLE productos_bolsa (
    idprobolsa SERIAL PRIMARY KEY,
    idbolsa INTEGER NOT NULL,
    idinventario INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idbolsa) REFERENCES bolsas (idbolsa) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idinventario) REFERENCES inventario (idinventario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Productos favoritos (se eliminó tabla intermedia innecesaria)
CREATE TABLE productos_favoritos (
    idprofav SERIAL PRIMARY KEY,
    idusuario INTEGER NOT NULL,
    idinventario INTEGER NOT NULL,
    FOREIGN KEY (idusuario) REFERENCES usuarios (idusuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idinventario) REFERENCES inventario (idinventario) ON UPDATE CASCADE ON DELETE RESTRICT    
);

-- Ventas
CREATE TABLE ventas (
    idventa SERIAL PRIMARY KEY,
    idusuario INTEGER NOT NULL,
    idbolsa INTEGER NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    idestado INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios (idusuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idbolsa) REFERENCES bolsas (idbolsa) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (idestado) REFERENCES estado (idestado) ON UPDATE CASCADE ON DELETE RESTRICT
);

