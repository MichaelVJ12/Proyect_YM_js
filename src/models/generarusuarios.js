const { Client } = require('pg');

const bcrypt = require('bcrypt');



const usuarios = [
  {
    correo: 'admin@yestistore.com',
    contrasena: 'admin123',
    nombre: 'Ana',
    apellido: 'Ruiz',
    nacimiento: '1990-01-15',
    telefono: '1234567',
    celular: '3001234567',
    tipo: 1 // Administrador
  },
  {
    correo: 'empleado@yestistore.com',
    contrasena: 'empleado123',
    nombre: 'Carlos',
    apellido: 'López',
    nacimiento: '1995-06-20',
    telefono: '2345678',
    celular: '3007654321',
    tipo: 2 // Empleado
  },
  {
    correo: 'cliente@yestistore.com',
    contrasena: 'cliente123',
    nombre: 'Laura',
    apellido: 'Martínez',
    nacimiento: '2001-03-10',
    telefono: '3456789',
    celular: '3104567890',
    tipo: 3 // Cliente
  }
];

(async () => {
  const cliente = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ymdb',
    password: '123456', // aquí asegúrate que esté entre comillas
    port: 5432
  });

  try {
    await cliente.connect();

    for (const user of usuarios) {
      try {
        const hash = await bcrypt.hash(user.contrasena, 10);

        const query = `
          INSERT INTO usuarios (
            correo, contrasena, nombre, apellido, fecha_nacimiento,
            telefono, celular, imagen_perfil, idtipousuario
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8)
        `;

        const values = [
          user.correo,
          hash,
          user.nombre,
          user.apellido,
          user.nacimiento,
          user.telefono,
          user.celular,
          user.tipo
        ];

        await cliente.query(query, values);
        console.log(`✅ Usuario ${user.nombre} ${user.apellido} creado correctamente.`);
      } catch (err) {
        console.error(`❌ Error al insertar el usuario ${user.correo}:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  } finally {
    await cliente.end();
    console.log('🔒 Conexión cerrada.');
  }
})();