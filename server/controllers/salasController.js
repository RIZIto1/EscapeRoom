const salasModel = require('../models/salasModel.js');
const db = require('../config/config.js');

exports.crearSala = async (req, res) => {
    console.log('Solicitud recibida en crearSala:', req.body);
    const { nombre, capacidad, dificultad, tiempo, precio } = req.body;
    console.log('Campos extraídos:', { nombre, capacidad, dificultad, tiempo, precio });
    if (!nombre || !capacidad || !dificultad || !tiempo || !precio) {
        console.log('Validación fallida. Campos faltantes:', { nombre, capacidad, dificultad, tiempo, precio });
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }
    try {
        const result = await salasModel.crearSala(nombre, capacidad, dificultad, tiempo, precio);
        console.log('Resultado de crearSala:', result);
        res.status(201).json({ message: 'Sala creada', salaId: result.insertId });
    } catch (error) {
        console.error('Error en crearSala:', error);
        res.status(500).json({ error: 'Error al crear sala', details: error.message });
    }
};

exports.getAllSalas = async (req, res) => {
    try {
        const salas = await salasModel.getAllSalas();
        res.status(200).json(salas);
    } catch (error) {
        console.error('Error en getAllSalas:', error);
        res.status(500).json({ error: 'Error al obtener salas', details: error.message });
    }
};

exports.updateSala = async (req, res) => {
    const { id } = req.params;
    const { nombre, capacidad, dificultad, tiempo, precio } = req.body;
    try {
        const result = await salasModel.updateSala(id, nombre, capacidad, dificultad, tiempo, precio);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }
        res.json({ message: 'Sala actualizada' });
    } catch (error) {
        console.error('Error en updateSala:', error);
        res.status(500).json({ error: 'Error al actualizar sala', details: error.message });
    }
};

exports.deleteSala = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await salasModel.deleteSala(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }
        res.json({ message: 'Sala eliminada'});
    } catch (error) {
        console.error('Error en deleteSala:', error);
        res.status(500).json({ error: 'Error al eliminar sala', details: error.message });
    }
};