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
    nombre VARCHAR(100) DEFAULT 'Principal',
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

--insersión de productos y variantes
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Culpa Error', 'A quasi earum voluptas sapiente perspiciatis.', 108000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 5, 3, 24);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 4, 1, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 6, 3, 7);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 3, 1, 23);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 1, 1, 7);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (1, 2, 3, 6);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Dolor Explicabo', 'Qui est soluta ad.', 174000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (2, 2, 2, 30);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (2, 4, 1, 29);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (2, 5, 1, 5);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Ea Libero', 'Distinctio aliquam laboriosam maiores.', 189000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (3, 4, 1, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (3, 1, 1, 16);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (3, 2, 2, 6);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (3, 6, 3, 20);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (3, 3, 3, 5);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Nobis Eligendi', 'Nemo expedita molestias dignissimos occaecati nulla reprehenderit.', 124000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (4, 6, 3, 6);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (4, 5, 2, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (4, 2, 1, 30);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (4, 3, 2, 16);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (4, 1, 2, 26);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Voluptatem Similique', 'Quae possimus ab deserunt nostrum.', 51000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (5, 1, 1, 7);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (5, 2, 1, 25);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (5, 3, 1, 13);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (5, 6, 1, 14);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (5, 4, 3, 17);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Deserunt Nam', 'Ducimus beatae minus voluptatibus.', 62000.0, 8);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (6, 1, 3, 15);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (6, 2, 3, 24);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (6, 5, 1, 9);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (6, 6, 1, 30);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Aliquid Modi', 'Consequuntur dolore neque saepe aspernatur totam cupiditate ipsa.', 95000.0, 4);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (7, 6, 2, 17);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (7, 1, 1, 28);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (7, 5, 3, 23);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (7, 3, 2, 18);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Assumenda Accusantium', 'Doloremque nobis dignissimos hic sed.', 157000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 3, 1, 23);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 4, 3, 11);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 5, 3, 25);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 6, 2, 7);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 1, 1, 22);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (8, 2, 2, 5);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Omnis Rem', 'Laudantium qui natus voluptatem asperiores ratione.', 70000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (9, 4, 2, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (9, 3, 2, 30);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (9, 6, 1, 9);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Minus Nostrum', 'Est fugiat autem atque illo.', 119000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (10, 4, 1, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (10, 5, 2, 19);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (10, 1, 1, 5);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Deleniti Vitae', 'Nulla occaecati sunt tempore veniam quidem.', 142000.0, 9);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (11, 1, 1, 14);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (11, 2, 2, 26);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (11, 6, 1, 10);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Voluptate Debitis', 'Nam ducimus placeat ducimus suscipit expedita aliquam.', 134000.0, 3);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (12, 4, 3, 26);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (12, 2, 2, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (12, 5, 1, 15);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (12, 1, 1, 20);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Voluptates Vel', 'Beatae quos laboriosam nisi omnis quasi distinctio.', 198000.0, 9);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 2, 1, 22);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 5, 2, 22);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 3, 3, 22);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 1, 2, 14);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 6, 3, 6);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (13, 4, 1, 27);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Vitae Dicta', 'Illo adipisci natus eos occaecati ipsa beatae.', 98000.0, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (14, 1, 2, 28);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (14, 4, 2, 10);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (14, 5, 1, 12);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Voluptatibus Voluptas', 'Eius veritatis cumque.', 125000.0, 4);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (15, 5, 1, 11);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (15, 2, 1, 14);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (15, 6, 3, 13);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (15, 1, 2, 9);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Sequi Officia', 'Neque facilis nihil quibusdam accusantium expedita.', 59000.0, 6);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (16, 5, 1, 26);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (16, 4, 1, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (16, 6, 1, 17);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (16, 2, 3, 6);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Cum Sequi', 'Eveniet facilis architecto velit dolore.', 162000.0, 1);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (17, 1, 3, 14);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (17, 4, 1, 10);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (17, 3, 3, 23);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (17, 2, 2, 29);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Quisquam Accusantium', 'Libero aut repellendus sapiente odit culpa.', 143000.0, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (18, 1, 2, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (18, 2, 2, 26);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (18, 3, 3, 27);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Temporibus Aspernatur', 'Consequatur amet inventore praesentium aliquam.', 132000.0, 3);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (19, 3, 1, 23);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (19, 4, 3, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (19, 5, 3, 18);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (19, 6, 1, 25);
INSERT INTO productos (nombre, descripcion, precio, idsubcategoria) VALUES ('Aliquid Nobis', 'Veniam perferendis consequuntur deserunt a tenetur quod.', 142000.0, 2);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (20, 2, 3, 5);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (20, 5, 3, 6);
INSERT INTO inventario (idproducto, idtalla, idcolor, cantidad) VALUES (20, 3, 3, 28);
