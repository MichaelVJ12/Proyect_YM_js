const { Client } = require('pg');
const bdconfig = require('../config/db.config');

const obtenerDepartamentos = async() => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `select * from departamentos`;

        const resultado = await cliente.query(query);
        return resultado.rows
    } catch (error) {
        console.error(error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

const obtenerMunicipios = async(iddepartamento) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `select * from municipios where iddepartamento = $1`;

        const resultado = await cliente.query(query, [iddepartamento]);
        return resultado.rows
    } catch (error) {
        console.error(error);
        throw error;    
    } finally {
        await cliente.end();
    }
};

module.exports = {obtenerDepartamentos, obtenerMunicipios};
