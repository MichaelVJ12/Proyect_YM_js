const { body } = require('express-validator');

const validarRegistro = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras.')
    .trim().toUpperCase(),
  
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo puede contener letras.')
    .trim().toUpperCase(),

  body('email')
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('Debe ser un correo válido.')
    .trim().normalizeEmail(),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
    .trim(),

  body('contrasena_2')
    .notEmpty().withMessage('Debes confirmar tu contraseña.').trim()
    .custom((value, { req }) => {
      if (value !== req.body.contrasena) {
        throw new Error('Las contraseñas no coinciden.');
      }
      return true;
    }),

  body('fecha')
    .notEmpty().withMessage('La fecha de nacimiento es obligatoria.')
    .isDate().withMessage('Debe ser una fecha válida.'),
];

const validarLogin = [
  body('email')
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('Debe ser un correo válido.')
    .trim().normalizeEmail(),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria.').trim()
];

module.exports = { validarRegistro, validarLogin };
