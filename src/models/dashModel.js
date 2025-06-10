const { Client } = require('pg');
const bdconfig = require('../config/db.config');

// EN dashModel.js
const getInventario = async () => {
    const cliente = new Client(bdconfig);

    try {
        await cliente.connect();

        const query = `
            SELECT 
                i.idinventario,
                p.nombre,
                c.descripcion_categoria AS categoria,
                sc.descripcion_subcategoria AS subcategoria,
                t.descripcion_talla AS talla,
                col.descripcion_color AS color,
                i.cantidad AS stock,
                p.precio,
                CONCAT('INV-', i.idinventario) AS sku,
                i.idestado
            FROM inventario i
            INNER JOIN productos p ON p.idproducto = i.idproducto
            INNER JOIN subcategorias sc ON sc.idsubcategoria = p.idsubcategoria
            INNER JOIN categorias c ON c.idcategoria = sc.idcategoria
            INNER JOIN tallas t ON t.idtalla = i.idtalla
            INNER JOIN colores col ON col.idcolor = i.idcolor
            ORDER BY i.idestado ASC, i.idinventario ASC`; 

        const resultado = await cliente.query(query);
        return resultado.rows;
    } catch (error) {
        console.error('Error en getInventario:', error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

const updateInventarioEstado = async (idInventario, idEstado) => {
    const cliente = new Client(bdconfig);
    try {
        await cliente.connect();
        await cliente.query(
            'UPDATE inventario SET idestado = $1 WHERE idinventario = $2',
            [idEstado, idInventario]
        );
    } catch (error) {
        console.error('Error al actualizar estado del inventario:', error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getInventarioById = async (id) => {
  const cliente = new Client(bdconfig);
  try {
    await cliente.connect();

    const consulta = 'SELECT * FROM inventario WHERE idinventario = $1';
    const resultado = await cliente.query(consulta, [id]);
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en getInventarioById:', error);
    throw error;
  } finally {
    await cliente.end();
  }
};

const getVentas = async () => {
    const cliente = new Client(bdconfig);

    try {
        await cliente.connect();
        const query = `
            SELECT 
                v.idventa,
                u.nombre || ' ' || u.apellido AS cliente,
                TO_CHAR(v.fecha_hora, 'DD/MM/YY  HH12 AM') AS fecha,
                SUM(p.precio * pb.cantidad) AS total,
                e.descripcion_estado AS estado
            FROM ventas v
            INNER JOIN usuarios u ON u.idusuario = v.idusuario
            INNER JOIN estado e ON e.idestado = v.idestado
            INNER JOIN bolsas b ON b.idbolsa = v.idbolsa
            INNER JOIN productos_bolsa pb ON pb.idbolsa = b.idbolsa
            INNER JOIN inventario i ON i.idinventario = pb.idinventario
            INNER JOIN productos p ON p.idproducto = i.idproducto
            WHERE pb.idestado = 1 AND i.idestado = 1 AND p.idestado = 1
            GROUP BY v.idventa, u.nombre, u.apellido, v.fecha_hora, e.descripcion_estado
            ORDER BY v.fecha_hora DESC
        `;
        const resultado = await cliente.query(query);
        return resultado.rows;
    } catch (error) {
        console.error('Error en getVentas:', error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getDetallesVenta = async (idventa) => {
  const cliente = new Client(bdconfig);
  await cliente.connect();

  const result = await cliente.query(`
    SELECT 
      p.nombre, 
      p.precio, 
      pb.cantidad,
      (p.precio * pb.cantidad) AS subtotal
    FROM ventas v
    JOIN bolsas b ON b.idbolsa = v.idbolsa
    JOIN productos_bolsa pb ON pb.idbolsa = b.idbolsa
    JOIN inventario i ON i.idinventario = pb.idinventario
    JOIN productos p ON p.idproducto = i.idproducto
    WHERE v.idventa = $1
      AND pb.idestado = 1 
      AND i.idestado = 1 
      AND p.idestado = 1
  `, [idventa]);

  await cliente.end();
  return result.rows;
};

const getCantidadStock = async () => {
  const cliente = new Client(bdconfig);
  await cliente.connect();
  const result = await cliente.query(`
    SELECT SUM(cantidad) AS total
    FROM inventario
    WHERE idestado = 1
  `);
  await cliente.end();
  return parseInt(result.rows[0].total || 0);
};

const getTotalVentas = async () => {
  const cliente = new Client(bdconfig);
  await cliente.connect();
  const result = await cliente.query(`
    SELECT COUNT(*) AS total
    FROM ventas
    WHERE idestado = 1
      AND EXTRACT(MONTH FROM fecha_hora) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha_hora) = EXTRACT(YEAR FROM CURRENT_DATE)
  `);
  await cliente.end();
  return parseInt(result.rows[0].total || 0);
};

const getTotalIngresos = async () => {
  const cliente = new Client(bdconfig);
  await cliente.connect();
  const result = await cliente.query(`
    SELECT SUM(p.precio * pb.cantidad) AS total
    FROM ventas v
    JOIN bolsas b ON b.idbolsa = v.idbolsa
    JOIN productos_bolsa pb ON pb.idbolsa = b.idbolsa
    JOIN inventario i ON i.idinventario = pb.idinventario
    JOIN productos p ON p.idproducto = i.idproducto
    WHERE pb.idestado = 1 AND i.idestado = 1 AND p.idestado = 1
      AND EXTRACT(MONTH FROM v.fecha_hora) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM v.fecha_hora) = EXTRACT(YEAR FROM CURRENT_DATE)
  `);
  await cliente.end();
  return parseFloat(result.rows[0].total || 0);
};


const getUsuariosFrecuentes = async () => {
  const cliente = new Client(bdconfig);
  await cliente.connect();
  const result = await cliente.query(`
    SELECT u.nombre, u.apellido, u.correo, COUNT(v.idventa) AS compras
    FROM ventas v
    JOIN usuarios u ON u.idusuario = v.idusuario
    GROUP BY u.idusuario
    ORDER BY compras DESC
    LIMIT 5
  `);
  await cliente.end();
  return result.rows;
};

const getVentasPorSemana = async () => {
    const cliente = new Client(bdconfig);
    await cliente.connect();
  
    // La consulta extrae el día, mes y año para procesarlos en JavaScript.
    const query = `
      SELECT 
        EXTRACT(DAY FROM v.fecha_hora) AS dia,
        EXTRACT(MONTH FROM v.fecha_hora) AS mes,
        EXTRACT(YEAR FROM v.fecha_hora) AS anio,
        SUM(p.precio * pb.cantidad) AS total
      FROM ventas v
      JOIN bolsas b ON b.idbolsa = v.idbolsa
      JOIN productos_bolsa pb ON pb.idbolsa = b.idbolsa
      JOIN inventario i ON i.idinventario = pb.idinventario
      JOIN productos p ON p.idproducto = i.idproducto
      WHERE pb.idestado = 1 AND i.idestado = 1 AND p.idestado = 1
        AND v.fecha_hora >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND v.fecha_hora < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY dia, mes, anio
      ORDER BY anio, mes, dia
    `;
  
    const result = await cliente.query(query);
    await cliente.end();
  
    // Inicializamos los arreglos para las 4 semanas de cada mes.
    const ventasMesActual = [0, 0, 0, 0];
    const ventasMesPasado = [0, 0, 0, 0];
  
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    
    // Calcula el mes y año anterior correctamente, manejando el cambio de año.
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
  
    result.rows.forEach(row => {
      const dia = parseInt(row.dia);
      const mes = parseInt(row.mes);
      const anio = parseInt(row.anio);
      const total = parseFloat(row.total);
  
      // Determina el índice de la semana (0-3) basado en el día del mes.
      let semanaIndex;
      if (dia <= 7) {
        semanaIndex = 0; // Semana 1
      } else if (dia <= 14) {
        semanaIndex = 1; // Semana 2
      } else if (dia <= 21) {
        semanaIndex = 2; // Semana 3
      } else {
        semanaIndex = 3; // Semana 4
      }
  
      // Acumula el total en el arreglo y semana correctos.
      if (mes === mesActual && anio === anioActual) {
        ventasMesActual[semanaIndex] += total;
      } else if (mes === mesAnterior && anio === anioAnterior) {
        ventasMesPasado[semanaIndex] += total;
      }
    });
  
    return { ventasMesActual, ventasMesPasado };
};

const getVentasResumenMensual = async () => {
  const cliente = new Client(bdconfig);
  await cliente.connect();

  const query = `
    WITH resumen AS (
      SELECT 
        EXTRACT(MONTH FROM v.fecha_hora) AS mes,
        EXTRACT(YEAR FROM v.fecha_hora) AS anio,
        COUNT(DISTINCT v.idventa) AS total_ventas,
        SUM(p.precio * pb.cantidad) AS total_ingresos
      FROM ventas v
      JOIN bolsas b ON b.idbolsa = v.idbolsa
      JOIN productos_bolsa pb ON pb.idbolsa = b.idbolsa
      JOIN inventario i ON i.idinventario = pb.idinventario
      JOIN productos p ON p.idproducto = i.idproducto
      WHERE pb.idestado = 1 AND i.idestado = 1 AND p.idestado = 1
      GROUP BY mes, anio
    )
    SELECT * FROM resumen
    WHERE (anio = EXTRACT(YEAR FROM CURRENT_DATE) AND mes IN (
      EXTRACT(MONTH FROM CURRENT_DATE),
      EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
    ))
  `;

  const result = await cliente.query(query);
  await cliente.end();

  let actual = { ventas: 0, ingresos: 0 };
  let anterior = { ventas: 0, ingresos: 0 };

  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  result.rows.forEach(row => {
    const mes = parseInt(row.mes);
    const anio = parseInt(row.anio);
    const ventas = parseInt(row.total_ventas);
    const ingresos = parseFloat(row.total_ingresos);

    if (mes === mesActual && anio === anioActual) {
      actual = { ventas, ingresos };
    } else {
      anterior = { ventas, ingresos };
    }
  });

  return { actual, anterior };
};

const updateImagenPerfil = async (id, imagenPath) => {
    const cliente = new Client(bdconfig);
    await cliente.connect();

    await cliente.query(`
        UPDATE usuarios
        SET imagen_perfil = $1
        WHERE idusuario = $2
    `, [imagenPath, id]);

    await cliente.end();
};

module.exports.updateImagenPerfil = updateImagenPerfil;

module.exports = {
  getInventario,
  getVentas,
  getCantidadStock,
  getTotalVentas,
  getTotalIngresos,
  getUsuariosFrecuentes,
  getVentasPorSemana,
  getVentasResumenMensual,
  updateImagenPerfil,
  updateInventarioEstado,
  getInventarioById,
  getDetallesVenta
};
