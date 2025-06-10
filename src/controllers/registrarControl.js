const {crearUsuario, verificarUsuario} = require('../models/usuarioModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const registrarUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array().map(err => ({
                msg: err.msg,
                param: err.path
            }))
        });
    }
    const {
        nombre,
        apellido,
        email,
        contrasena,
        contrasena_2,
        fecha    
    } = req.body;

    try {
        const yaExiste = await verificarUsuario(email);
        if (yaExiste) {
            return res.status(400).json({ errores: [{ param: 'email', msg:  'El correo ya está registrado.'}] });
        }

        const hash = await bcrypt.hash(contrasena, 10);
        
        const nuevoUsuario = await crearUsuario({
            nombre,
            apellido,
            email,
            contrasena: hash,
            fecha
        });

        res.status(201).json({ success: true, message: 'Registro exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errores: [{ msg: 'Error al registrar usuario'}] });
    }
};

module.exports = {registrarUsuario};
