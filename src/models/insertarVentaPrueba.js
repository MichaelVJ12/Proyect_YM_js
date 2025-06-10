const { Client } = require('pg');

(async () => {
  const cliente = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ymdb',
    password: '123456', // Tu contraseña real
    port: 5432
  });

  try {
    await cliente.connect();
    console.log('🔌 Conectado a la base de datos.');

    // 1. Crear usuario
    const usuarioRes = await cliente.query(
      `INSERT INTO usuarios (
         correo, contrasena, nombre, apellido, fecha_nacimiento, celular, idtipousuario
       ) VALUES (
         'cliente_prueba@yesti.com', 'clave123', 'Cliente', 'Prueba', '2000-01-01', '3001234567', 3
       )
       RETURNING idusuario`
    );
    const idusuario = usuarioRes.rows[0].idusuario;
    console.log(`🧍 Usuario prueba creado: ID ${idusuario}`);

    // 2. Crear bolsa
    const bolsaRes = await cliente.query(
      `INSERT INTO bolsas (idusuario, idestado) VALUES ($1, 1) RETURNING idbolsa`,
      [idusuario]
    );
    const idbolsa = bolsaRes.rows[0].idbolsa;

    // 3. Obtener dos productos de inventario
    const invRes = await cliente.query(`SELECT idinventario FROM inventario LIMIT 2`);
    if (invRes.rows.length < 2) throw new Error('No hay suficientes productos en inventario.');

    const idinv1 = invRes.rows[0].idinventario;
    const idinv2 = invRes.rows[1].idinventario;

    // 4. Insertar productos en la bolsa
    await cliente.query(
      `INSERT INTO productos_bolsa (idbolsa, idinventario, cantidad, idestado)
       VALUES ($1, $2, 1, 1), ($1, $3, 2, 1)`,
      [idbolsa, idinv1, idinv2]
    );

    // 5. Calcular total desde productos
    const precios = await cliente.query(`
      SELECT p.precio, pb.cantidad
      FROM productos_bolsa pb
      JOIN inventario i ON i.idinventario = pb.idinventario
      JOIN productos p ON p.idproducto = i.idproducto
      WHERE pb.idbolsa = $1
    `, [idbolsa]);

    const total = precios.rows.reduce((sum, r) => sum + r.precio * r.cantidad, 0);

    // 6. Insertar venta
    await cliente.query(
        `INSERT INTO ventas (idusuario, idbolsa, fecha_hora, idestado)
        VALUES ($1, $2, NOW(), 1)`,
        [idusuario, idbolsa]
    );


    console.log(`✅ Venta prueba creada con total $${total.toLocaleString('es-CO')}.`);
  } catch (err) {
    console.error('❌ Error al insertar la venta:', err.message);
  } finally {
    await cliente.end();
    console.log('🔒 Conexión cerrada.');
  }
})();

