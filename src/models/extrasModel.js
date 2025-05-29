const { Client } = require('pg');
const bdconfig = require('../config/db.config');

const getDepartamentos = async() => {
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

const getMunicipios = async(iddepartamento) => {
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

const getTotalBolsa = async(idusuario) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `
            select count(*) from productos_bolsa 
            inner join bolsas on producto_bolsa.idbolsa = idbolsa 
            inner join usuarios on bolsas.idusuario = $1`;
        
        const resultado = await cliente.query(query, [idusuario]);
        return parseInt(resultado.rows[0].count)
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getTotalFavoritos = async(idusuario) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `
            select count(*) from productos_favoritos 
            inner join usuarios on productos_favoritos.idusuario = $1`;
        
        const resultado = await cliente.query(query, [idusuario]);
        return parseInt(resultado.rows[0].count)
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getTotalPedidos = async(idusuario) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `
            select count(*) from ventas 
            inner join usuarios on ventas.idusuario = $1`;
        
        const resultado = await cliente.query(query, [idusuario]);
        return parseInt(resultado.rows[0].count)
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

const getTotalPagado = async(idusuario) => {
    const cliente = new Client(bdconfig);
    
    try {
        await cliente.connect();
        
        const query = `
            select coalesce(sum(productos.precio * productos_bolsa.cantidad), 0) from ventas 
            inner join bolsas on ventas.idbolsa = bolsas.idbolsa 
            inner join productos_bolsa on productos_bolsa.idbolsa = bolsas.idbolsa 
            inner join inventario on productos_bolsa.idinventario = inventario.idinventario 
            inner join productos on productos.idproducto = inventario.idproducto 
            inner join usuarios on ventas.idusuario = $1`;
        
        const resultado = await cliente.query(query, [idusuario]);
        return resultado.rows[0].sum
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await cliente.end();
    }
};

module.exports = {getDepartamentos, getMunicipios, getTotalBolsa, getTotalFavoritos, getTotalPedidos, getTotalPagado};
