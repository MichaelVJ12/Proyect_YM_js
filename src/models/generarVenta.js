const { Client } = require('pg');

const ventas = [
  {
    idusuario: 3, // ID del cliente (Laura Martínez)
    idbolsa: 1,
    productos: [
      { idinventario: 1, cantidad: 2 }, // Culpa Error - XL - #FF5733
      { idinventario: 5, cantidad: 1 }  // Culpa Error - XS - #000000
    ]
  },
  {
    idusuario: 3, // ID del cliente (Laura Martínez)
    idbolsa: 2,
    productos: [
      { idinventario: 12, cantidad: 1 }, // Voluptate Debitis - L - #FF5733
      { idinventario: 18, cantidad: 3 }  // Nobis Eligendi - M - #FFFFFF
    ]
  },
  {
    idusuario: 3, // ID del cliente (Laura Martínez)
    idbolsa: 3,
    productos: [
      { idinventario: 25, cantidad: 2 }, // Vitae Dicta - XS - #FFFFFF
      { idinventario: 30, cantidad: 1 },  // Voluptatibus Voluptas - S - #000000
      { idinventario: 35, cantidad: 1 }   // Sequi Officia - XXL - #000000
    ]
  }
];

(async () => {
  const cliente = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ymdb',
    password: '123456',
    port: 5432
  });

  try {
    await cliente.connect();

    // Insertar bolsas y productos en bolsas
    for (const venta of ventas) {
      try {
        // Primero creamos la bolsa
        const queryBolsa = `
          INSERT INTO bolsas (idusuario, idestado)
          VALUES ($1, 1)
          RETURNING idbolsa
        `;
        
        const resBolsa = await cliente.query(queryBolsa, [venta.idusuario]);
        const idbolsa = resBolsa.rows[0].idbolsa;

        // Luego insertamos los productos en la bolsa
        for (const producto of venta.productos) {
          const queryProductoBolsa = `
            INSERT INTO productos_bolsa (idbolsa, idinventario, cantidad, idestado)
            VALUES ($1, $2, $3, 1)
          `;
          
          await cliente.query(queryProductoBolsa, [
            idbolsa,
            producto.idinventario,
            producto.cantidad
          ]);
        }

        // Finalmente creamos la venta
        const queryVenta = `
          INSERT INTO ventas (idusuario, idbolsa, fecha_hora, idestado)
          VALUES ($1, $2, NOW(), 1)
        `;
        
        await cliente.query(queryVenta, [venta.idusuario, idbolsa]);
        
        console.log(`✅ Venta creada correctamente para el usuario ${venta.idusuario} con bolsa ${idbolsa}`);
      } catch (err) {
        console.error(`❌ Error al insertar la venta:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  } finally {
    await cliente.end();
    console.log('🔒 Conexión cerrada.');
  }
})();