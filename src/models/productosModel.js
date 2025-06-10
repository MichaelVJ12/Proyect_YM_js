const { Client } = require('pg');
const bdconfig = require('../config/db.config');

const getProductos = async() => {
    const cliente = new Client(bdconfig);
    
    try{
        await cliente.connect();
        
        const query = `select * from productos where idestado = 1`;
        
        const resultado = await cliente.query(query);
        return resultado.rows
    } catch (error) {
        console.error(error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

const getVariantes = async(idproducto) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `select * from inventario where idproducto = $1 and idestado = 1`;
        
        const resultado = await cliente.query(query, [idproducto]);
        return resultado.rows
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getNovedades = async() => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `select * from productos where idestado = 1 order by fecha_creacion desc limit 12`;
        
        const resultado = await cliente.query(query);
        return resultado.rows
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

module.exports = {getProductos, getVariantes, getNovedades};
