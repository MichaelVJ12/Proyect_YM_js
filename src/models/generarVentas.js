const { Client } = require('pg');
const bcrypt = require('bcrypt');

// 1. Define los nuevos usuarios que se van a crear
const nuevosUsuarios = [
  {
    correo: 'ricardo.melo@email.com',
    contrasena: 'ricardo2025',
    nombre: 'Ricardo',
    apellido: 'Melo',
    nacimiento: '1991-04-12',
    celular: '3215550101'
  },
  {
    correo: 'camila.torres@email.com',
    contrasena: 'camiTowers99',
    nombre: 'Camila',
    apellido: 'Torres',
    nacimiento: '1999-08-30',
    celular: '3215550102'
  },
  {
    correo: 'andres.rojas@email.com',
    contrasena: 'andresitoR.1',
    nombre: 'Andrés',
    apellido: 'Rojas',
    nacimiento: '2000-01-25',
    celular: '3215550103'
  },
  {
    correo: 'valentina.cruz@email.com',
    contrasena: 'valenCruz_03',
    nombre: 'Valentina',
    apellido: 'Cruz',
    nacimiento: '2003-03-15',
    celular: '3215550104'
  }
];

// 2. Define las ventas para los usuarios que se crearán
// Se asignarán dinámicamente usando los IDs de los usuarios de arriba.
const nuevasVentas = [
  {
    // Venta para Ricardo Melo
    userIndex: 0, 
    fecha_venta: '2025-05-15 11:30:00', // Mes pasado
    productos: [
      { idinventario: 2, cantidad: 1 },  // 'Culpa Error' - L - #000000
      { idinventario: 11, cantidad: 1 }  // 'Ea Libero' - XS - #000000
    ]
  },
  {
    // Venta para Camila Torres
    userIndex: 1, 
    fecha_venta: '2025-05-28 18:00:00', // Mes pasado
    productos: [
      { idinventario: 20, cantidad: 2 }, // 'Voluptatem Similique' - XS - #000000
      { idinventario: 31, cantidad: 1 }, // 'Voluptatibus Voluptas' - XXL - #000000
      { idinventario: 40, cantidad: 1 }  // 'Sequi Officia' - L - #000000
    ]
  },
  {
    // Venta para Andrés Rojas
    userIndex: 2, 
    fecha_venta: '2025-06-02 09:15:00', // Mes actual
    productos: [
      { idinventario: 26, cantidad: 1 }, // 'Vitae Dicta' - L - #FFFFFF
      { idinventario: 27, cantidad: 1 }  // 'Vitae Dicta' - XL - #000000
    ]
  },
  {
    // Otra venta para Ricardo Melo
    userIndex: 0,
    fecha_venta: '2025-06-05 14:00:00', // Mes actual
    productos: [
      { idinventario: 50, cantidad: 1 } // 'Quisquam Accusantium' - M - #FFFFFF
    ]
  },
  {
    // Venta para Valentina Cruz
    userIndex: 3, 
    fecha_venta: '2025-06-08 20:45:00', // Mes actual
    productos: [
      { idinventario: 42, cantidad: 1 }, // 'Cum Sequi' - L - #000000
      { idinventario: 45, cantidad: 3 }  // 'Quisquam Accusantium' - XS - #FFFFFF
    ]
  }
];


(async () => {
  // Configuración de la conexión a la base de datos
  const cliente = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ymdb',
    password: '123456', // Tu contraseña
    port: 5432
  });

  try {
    await cliente.connect();
    console.log('🔌 Conexión a la base de datos establecida.');

    const nuevosIdsDeUsuario = [];

    // --- SECCIÓN DE CREACIÓN DE USUARIOS ---
    console.log('\n--- Iniciando creación de usuarios ---');
    for (const user of nuevosUsuarios) {
      try {
        const hash = await bcrypt.hash(user.contrasena, 10);
        const query = `
          INSERT INTO usuarios (
            correo, contrasena, nombre, apellido, fecha_nacimiento,
            celular, idtipousuario
          ) VALUES ($1, $2, $3, $4, $5, $6, 3)
          RETURNING idusuario
        `;
        const values = [user.correo, hash, user.nombre, user.apellido, user.nacimiento, user.celular];
        const res = await cliente.query(query, values);
        const nuevoId = res.rows[0].idusuario;
        nuevosIdsDeUsuario.push(nuevoId);
        console.log(`✅ Usuario ${user.nombre} ${user.apellido} creado con ID: ${nuevoId}.`);
      } catch (err) {
        console.error(`❌ Error al insertar al usuario ${user.correo}:`, err.message);
      }
    }

    // --- SECCIÓN DE CREACIÓN DE VENTAS ---
    console.log('\n--- Iniciando creación de ventas ---');
    for (const venta of nuevasVentas) {
      const idusuario = nuevosIdsDeUsuario[venta.userIndex];
      if (!idusuario) {
          console.warn(`⚠️ Saltando venta porque el usuario con índice ${venta.userIndex} no fue creado.`);
          continue;
      }

      try {
        // 1. Crear la bolsa
        const resBolsa = await cliente.query(
          'INSERT INTO bolsas (idusuario, idestado) VALUES ($1, 1) RETURNING idbolsa',
          [idusuario]
        );
        const idbolsa = resBolsa.rows[0].idbolsa;

        // 2. Insertar productos en la bolsa
        for (const producto of venta.productos) {
          await cliente.query(
            'INSERT INTO productos_bolsa (idbolsa, idinventario, cantidad, idestado) VALUES ($1, $2, $3, 1)',
            [idbolsa, producto.idinventario, producto.cantidad]
          );
        }

        // 3. Crear el registro de la venta con fecha específica
        await cliente.query(
          'INSERT INTO ventas (idusuario, idbolsa, fecha_hora, idestado) VALUES ($1, $2, $3, 1)',
          [idusuario, idbolsa, venta.fecha_venta]
        );
        
        console.log(`✅ Venta creada para usuario ID ${idusuario} en la fecha ${venta.fecha_venta}.`);
      } catch (err) {
        console.error(`❌ Error al insertar la venta para el usuario ID ${idusuario}:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general de conexión o ejecución:', error.message);
  } finally {
    await cliente.end();
    console.log('\n🔒 Conexión cerrada.');
  }
})();