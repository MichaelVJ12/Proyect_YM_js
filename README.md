
# 🛍️ YMstore — Tienda en línea de ropa femenina

**YMstore** es una aplicación web diseñada para la venta de ropa femenina. Este proyecto simula una tienda en línea funcional, implementando un sistema de gestión de usuarios, productos, sesiones y autenticación, con una arquitectura modular y tecnologías modernas del stack JavaScript.

## 🚀 Tecnologías utilizadas

- **Backend:** Node.js + Express
- **Frontend:** HTML (EJS), CSS (puro + Bootstrap), JavaScript
- **Base de datos:** PostgreSQL
- **Gestión de sesiones:** express-session + cookies
- **Dependencias clave:**  
  - `multer` — carga de archivos  
  - `dotenv` — configuración con variables de entorno  
  - `bcrypt` — encriptación de contraseñas  
  - `jsonwebtoken` — autenticación vía tokens JWT  
  - `puppeteer` — generación de PDF u otras automatizaciones

## 📁 Estructura del proyecto

```
YM_BD2_DP/
├── YMstore.js              # Punto de entrada de la aplicación (servidor Express)
├── .env                    # Variables de entorno (configuración de la BD y sesiones)
├── package.json            # Dependencias y scripts
└── src/
    ├── config/             # Configuración de base de datos y sesiones
    ├── controllers/        # Lógica de controladores para rutas y funcionalidades
    ├── middlewares/        # Middleware para validaciones, autenticación, etc.
    ├── models/             # Consultas y estructuras relacionadas con la BD (PostgreSQL)
    ├── public/
    │   ├── css/            # Hojas de estilo personalizadas
    │   ├── js/             # Scripts del lado cliente
    │   └── docs/           # 📄 Documentación del proyecto y base de datos (ver abajo)
    ├── routes/
    │   ├── api.js          # Rutas para la API
    │   └── pages.js        # Rutas de navegación del sitio
    └── views/              # Plantillas EJS para renderizar las páginas HTML
```

### 📄 Documentación del Proyecto

Dentro de la carpeta [`/src/public/docs`](./src/public/docs) se encuentra:

- Diagramas de la base de datos
- Descripción de tablas y relaciones
- Documentación general del sistema
- Script de creación de la base de datos: `ymdb.sql`

Este script permite crear la base de datos `ymdb` con todas sus tablas y relaciones necesarias para el correcto funcionamiento del sistema.

## ⚙️ Instalación y ejecución

### Requisitos

- Node.js (v16 o superior)
- PostgreSQL
- Las siguientes dependencias de Node.js (ya incluidas en `package.json`):
  - `multer`, `dotenv`, `bcrypt`, `jsonwebtoken`, `puppeteer`

### 1. Clona el repositorio

```bash
git clone https://github.com/Jorkaed/YM_BD2_DP.git
cd YM_BD2_DP
```

### 2. Instala las dependencias

```bash
npm install
```

Esto instalará automáticamente todas las dependencias listadas, incluyendo `multer`, `dotenv`, `bcrypt`, `jsonwebtoken`, y `puppeteer`.

### 3. Configura el archivo `.env`

Crea un archivo `.env` en la raíz con esta estructura:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ymdb
DB_USER=postgres
DB_PASSWORD=123456
SESSION_SECRET=chocolate
```

> Asegúrate de que la base de datos `ymdb` exista. Puedes crearla con el script `ymdb.sql` ubicado en `/src/public/docs`.

### 4. Inicia la aplicación

Modo desarrollo (con reinicio automático):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

La app estará corriendo en: [http://localhost:3000](http://localhost:3000)

## 👥 Autores

**YMgroup** — Proyecto académico desarrollado por estudiantes para la materia **Base de Datos II - Desarrollo Orientado a Plataformas**.

- [Stevenson Jorkaed Arias Sanabria](https://github.com/Jorkaed)
- [Michael Enrique Vejar Jimenez](https://github.com/MichaelVJ12)

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Libre para uso académico y educativo.
