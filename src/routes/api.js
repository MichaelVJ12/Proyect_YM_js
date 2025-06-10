const express = require('express');
const router = express.Router();
const {registrarUsuario} = require('../controllers/registrarControl');
const {loguearUsuario} = require('../controllers/loginControl');
const {obtenerDepartamentos, obtenerMunicipios} = require('../controllers/extrasControl');
const {validarRegistro, validarLogin} = require('../middlewares/userValidation');

router.get('/departamentos', obtenerDepartamentos);
router.get('/municipios/:iddepartamento', obtenerMunicipios);
router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', validarLogin, loguearUsuario);
router.post('/logout', (req, res) => {
  if (!req.session.usuario) {
    console.warn("Intento de logout sin sesión activa.");
    return res.status(200).json({ success: false, message: 'No hay sesión activa' });
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }

    res.clearCookie('connect.sid');
    res.status(200).json({ success: true, message: 'Logout exitoso' });
  });
});

module.exports = router;
