const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const usuario = req.session.usuario || null;
  res.render('index', { usuario });
});

router.get('/tienda', (req, res) => {
  const usuario = req.session.usuario || null;
  res.render('store', { usuario });
});

module.exports = router;
