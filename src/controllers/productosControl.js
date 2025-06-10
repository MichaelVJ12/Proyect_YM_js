const { getProductos, getVariantes, getNovedades } = require('../models/productosModel');

const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await getProductos();
        res.locals.productos = productos;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const obtenerVariantes = async (req, res) => {
    try {
        const variantes = await getVariantes(req.params.idproducto);
        res.json(variantes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener variantes de producto' });
    }
};

const obtenerNovedades = async (req, res, next) => {
    try {
        const novedades = await getNovedades();
        res.locals.novedades = novedades;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener novedades' });
    }
};

module.exports = {obtenerProductos, obtenerVariantes, obtenerNovedades};
