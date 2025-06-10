const { getDepartamentos, getMunicipios, getTotalBolsa, getTotalFavoritos, getTotalPedidos, getTotalPagado } = require('../models/extrasModel');

const obtenerDepartamentos = async (req, res) => {
    try {
        const departamentos = await getDepartamentos();
        res.json(departamentos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener departamentos' });
    }
};

const obtenerMunicipios = async (req, res) => {
    try {
        const municipios = await getMunicipios(req.params.iddepartamento);
        res.json(municipios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener municipios' });
    }
};

const obtenerTotalBolsa = async (req, res) => {
    try {
        const totalBolsa = await getTotalBolsa(req.params.idusuario);
        res.json({ total: totalBolsa });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el total de productos en la bolsa' });
    }
};

const obtenerTotalFavoritos = async (req, res) => {
    try {
        const totalFavoritos= await getTotalFavoritos(req.params.idusuario);
        res.json({ total: totalFavoritos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el total de productos deseados' });
    }
};

const obtenerTotalPedidos = async (req, res) => {
    try {
        const totalPedidos = await getTotalPedidos(req.params.idusuario);
        res.json({ total: totalPedidos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el total de pedidos' });
    }
};

const obtenerTotalPagado = async (req, res) => {
    try {
        const totalPagado = await getTotalPagado(req.params.idusuario);
        res.json({ total: totalPagado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el total pagado' });
    }
};

module.exports = { obtenerDepartamentos, obtenerMunicipios,  obtenerTotalBolsa, obtenerTotalFavoritos, obtenerTotalPedidos, obtenerTotalPagado };
