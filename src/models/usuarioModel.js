const { Client } = require('pg');
const bdconfig = require('../config/db.config');
const bcrypt = require('bcrypt');

const verificarUsuario = async(email) => {

    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `select * from usuarios where correo = $1`;

        const resultado = await cliente.query(query, [email]);
        return resultado.rows[0]
    } catch (error) {
        console.error(error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

const verificarContrasena = async(email, password) => {
    const usuario = await verificarUsuario(email);
    if (!usuario) return false;
    
    if (!usuario.contrasena) return false;

    const comprobacion = await bcrypt.compare(password, usuario.contrasena);
    if (!comprobacion) return false;

    return usuario;
};

const crearUsuario = async (datos) => {
    const{
        nombre,
        apellido,
        email,
        contrasena,
        fecha,  
    } = datos;

    const cliente = new Client(bdconfig);

    try {
        await cliente.connect();

        const query = `INSERT INTO usuarios(nombre, apellido, correo, contrasena, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING idusuario`;

        const valores = [
        nombre,
        apellido,
        email,
        contrasena,
        fecha    
        ];

        const resultado = await cliente.query(query, valores);  
        return resultado.rows[0]
    } catch (error) {
        console.error(error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

module.exports = {verificarUsuario, verificarContrasena, crearUsuario};
