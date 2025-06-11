const express = require('express');
const router = express.Router();
const {obtenerProductos, obtenerNovedades} = require('../controllers/productosControl');
const dashModel = require('../models/dashModel');
const dashControl = require('../controllers/dashControl');
const { actualizarImagenPerfil } = require('../controllers/dashControl');
const upload = require('../middlewares/upload');
const { verificarSesion } = require('../middlewares/auth');

router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  console.log('Usuario en sesión:', res.locals.usuario);
  next();
});

router.get('/', obtenerNovedades, (req, res) => {
  const usuario = res.locals.usuario;

  if (usuario && (usuario.tipo == 1 || usuario.tipo == 2)) {
    return res.redirect('/dashboard');
  } else {
    res.render('index', {
      usuario,
      novedades: res.locals.novedades || []
    });
    console.log(usuario, res.locals.novedades);
  }
});

router.get('/tienda', obtenerProductos, (req, res) => { 
  const usuario = res.locals.usuario;

  if (usuario && (usuario.tipo == 1 || usuario.tipo == 2)) {
    return res.redirect('/dashboard');
  } else {
    const productos = res.locals.productos || [];
    res.render('store', { usuario, productos });
    console.log(usuario, productos);
  }
});

router.get('/dashboard', verificarSesion, dashControl.renderDashboard);

router.get('/inventario', verificarSesion, dashControl.renderInventario);

router.get('/reporte/inventario', verificarSesion, dashControl.generarReporteInventario);

router.post('/inventario/cambiar-estado/:id', dashControl.cambiarEstadoInventario);

router.get('/ventas', verificarSesion, dashControl.renderVentas);

router.get('/reporte/ventas', verificarSesion, dashControl.generarReporteVentas);

router.get('/perfil', verificarSesion, (req, res) => {
  res.render('dash_perfil');
});

router.post('/perfil/imagen', verificarSesion, upload.single('imagen_perfil'), actualizarImagenPerfil);

module.exports = router;