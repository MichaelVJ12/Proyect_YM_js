const { verificarUsuario, verificarContrasena } = require('../models/usuarioModel');
const { validationResult } = require('express-validator');

const loguearUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array().map(err => ({
                msg: err.msg,
                param: err.path
            }))
        });
    }

    const { email, contrasena } = req.body;

    try {
        const yaExiste = await verificarUsuario(email);
        if (!yaExiste) {
            return res.status(400).json({ errores: [{ param: 'email', msg:  'El correo no está registrado.'}] });
        }

        const usuario = await verificarContrasena(email, contrasena);

        if (!usuario) {
            return res.status(401).json({ errores: [{ param: 'contrasena', msg: 'Contraseña incorrecta.' }] });
        }
                
        const nombreArray = usuario.nombre.split(' ');
        const apellidoArray = usuario.apellido.split(' ');
        const nombreCompuesto = nombreArray[0].charAt(0)+nombreArray[0].toLowerCase().slice(1)+" "+apellidoArray[0].charAt(0)+apellidoArray[0].toLowerCase().slice(1);
        
        req.session.usuario = {
            id: usuario.idusuario,
            nombre: nombreCompuesto,
            email: usuario.correo
        };
        console.log(req.session.usuario);
        res.status(201).json({ success: true, message: 'Logueo exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errores: [{ msg: 'Error al loguearse'}] });
    }
};

module.exports = { loguearUsuario };

