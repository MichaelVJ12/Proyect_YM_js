const express = require('express');
const router = express.Router();
const {registrarUsuario} = require('../controllers/registrarControl');
const {loguearUsuario} = require('../controllers/loginControl');
const {getDepartamentos, getMunicipios} = require('../controllers/extrasControl');
const {validarRegistro, validarLogin} = require('../middlewares/userValidation');

router.get('/departamentos', getDepartamentos);
router.get('/municipios/:iddepartamento', getMunicipios);
router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', validarLogin, loguearUsuario);
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }

    res.clearCookie('connect.sid');
    res.status(201).json({ success: true, message: 'Logout exitoso' });
  });
});

module.exports = router;
