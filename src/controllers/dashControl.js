const dashModel = require('../models/dashModel');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

exports.cambiarEstadoInventario = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await dashModel.getInventarioById(id);
    if (!item) {
      return res.status(404).send('Inventario no encontrado.');
    }

    // Cambia entre 1 (activo) y 2 (inactivo)
    const nuevoEstado = item.idestado === 1 ? 2 : 1;
    await dashModel.updateInventarioEstado(id, nuevoEstado);
    res.redirect('/inventario');
  } catch (error) {
    console.error('Error al cambiar estado del inventario:', error);
    res.status(500).send('Error al cambiar estado.');
  }
};

exports.renderVentas = async (req, res) => {
  try {
    const ventas = await dashModel.getVentas();

    // Por cada venta, obtenemos sus productos
    for (const venta of ventas) {
      venta.detalles = await dashModel.getDetallesVenta(venta.idventa)
      console.log('Venta con detalles:', venta);
    }
    res.render('dash_ventas', {
      title: 'Ventas Yesti Moda',
      ventas
    });
  } catch (error) {
    console.error('Error al renderizar ventas:', error);
    res.status(500).render('error', { message: 'Error al cargar las ventas' });
  }
};


exports.renderDashboard = async (req, res) => {
    try {
        const [
            cantidadStock,
            usuariosFrecuentes,
            ventasPorSemana,
            resumenMensual
        ] = await Promise.all([
            dashModel.getCantidadStock(),
            dashModel.getUsuariosFrecuentes(),
            dashModel.getVentasPorSemana(),
            dashModel.getVentasResumenMensual()
        ]);

        const { ventasMesActual, ventasMesPasado } = ventasPorSemana;
        const { actual, anterior } = resumenMensual;

        const totalVentas = actual.ventas;
        const totalIngresos = actual.ingresos;

        const calcularPorcentaje = (actual, anterior) => {
            if (anterior === 0) return actual > 0 ? 100 : 0;
            return ((actual - anterior) / anterior) * 100;
        };

        const variacionVentas = calcularPorcentaje(actual.ventas, anterior.ventas);
        const variacionIngresos = calcularPorcentaje(actual.ingresos, anterior.ingresos);

        res.render('dashboard', {
            cantidadStock,
            totalVentas,
            totalIngresos,
            usuariosFrecuentes,
            ventasMesActual,
            ventasMesPasado,
            variacionVentas,
            variacionIngresos,
        });

    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        res.status(500).render('error', { message: 'Error al cargar el dashboard' });
    }
};

exports.actualizarImagenPerfil = async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id;
    if (!req.file) return res.status(400).send('No se subió ninguna imagen.');

    const imagenPath = `/img/img_dashboard/${req.file.filename}`;
    const imagenAnterior = req.session.usuario.imagen;

    const imagenPorDefecto = '/img/img_dashboard/hacker.png';
    const imagenAnteriorNormalizada = imagenAnterior?.replace(/^\.\//, '');

    // Eliminar imagen anterior si no es la imagen por defecto
    if (imagenAnterior && imagenAnteriorNormalizada !== imagenPorDefecto) {
      const rutaFisica = path.join(__dirname, '..', 'public', imagenAnteriorNormalizada);
      fs.unlink(rutaFisica, (err) => {
        if (err) {
          console.warn('No se pudo eliminar la imagen anterior:', err.message);
        } else {
          console.log('Imagen anterior eliminada:', rutaFisica);
        }
      });
    }

    // Guardar la nueva ruta en la base de datos
    await dashModel.updateImagenPerfil(idUsuario, imagenPath);

    // Actualizar la sesión
    req.session.usuario.imagen = imagenPath;

    res.redirect('/perfil');
  } catch (error) {
    console.error('Error al actualizar imagen de perfil:', error);
    res.status(500).send('Error al actualizar la imagen.');
  }
};

exports.generarReporteInventario = async (req, res) => {
  try {
    const inventario = await dashModel.getInventario();

    const html = await ejs.renderFile(
        path.join(__dirname, '..', 'views', 'reports', 'inventario_pdf.ejs'),
        { inventario }
    );

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {left: '0.5cm', right: '0.5cm', top: '2cm', bottom: '2cm'},
      //displayHeaderFooter: true,
      //headerTemplate: ``
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Inventario.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF con Puppeteer:', error);
    res.status(500).send('Error al generar el reporte');
  }
};


exports.generarReporteVentas = async (req, res) => {
  try {
    const ventas = await dashModel.getVentas();

    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'reports', 'ventas_pdf.ejs'),
      { ventas }
    );

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { left: '0.5cm', right: '0.5cm', top: '2cm', bottom: '2cm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Ventas.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF de ventas:', error);
    res.status(500).send('Error al generar el reporte de ventas');
  }
};




