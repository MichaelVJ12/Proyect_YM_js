const { obtenerDepartamentos, obtenerMunicipios } = require('../models/extrasModel');
const { validationResult } = require('express-validator');

const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await obtenerDepartamentos();
        res.json(departamentos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener departamentos' });
    }
};

const getMunicipios = async (req, res) => {
    try {
        const municipios = await obtenerMunicipios(req.params.iddepartamento);
        res.json(municipios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener municipios' });
    }
};

module.exports = {getDepartamentos, getMunicipios};
