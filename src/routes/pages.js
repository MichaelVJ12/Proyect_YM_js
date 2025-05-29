const express = require('express');
const router = express.Router();
const {obtenerProductos, obtenerNovedades} = require('../controllers/productosControl');

router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

router.get('/', obtenerNovedades, (req, res) => {
  res.render('index');
  console.log(res.locals.usuario, res.locals.novedades);
});

router.get('/tienda', obtenerProductos, (req, res) => {
  res.render('store');
  console.log(res.locals.usuario, res.locals.productos);
});

module.exports = router;
