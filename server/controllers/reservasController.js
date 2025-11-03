const reservasModel = require('../models/reservasModel');
const db = require('../config/config.js');

exports.crearReserva = async (req, res) => {
    console.log('Solicitud recibida en crearReserva:', req.body);
    const { FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado } = req.body;
    console.log('Campos extraídos:', { FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado });

    if (!FK_ID_horarios || !FK_ID_salas || !FK_ID_usuarios || !fecha || !jugadores || !estado) {
        console.log('Validación fallida. Campos faltantes:', { FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total });
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    try {
        const [salas] = await db.query('SELECT * FROM salas WHERE ID_salas = ?', [FK_ID_salas]);
        if (salas.length === 0) {
            console.log('Sala no encontrada con ID:', FK_ID_salas);
            return res.status(404).json({ error: 'Sala no encontrada' });
        }
        const precioPorPersona = salas[0].precio;
        const precio_total = precioPorPersona * jugadores;


        const result = await reservasModel.crearReserva(FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total);
        console.log('Resultado de crearReserva:', result);
        res.status(201).json({ message: 'Reserva creada exitosamente', ID_reservas: result.insertId });
    } catch (error) {
        console.error('Error en crearReserva:', error);
        res.status(500).json({ error: 'Error al crear reserva', details: error.message });
    }
}

exports.getAllReservas = async (req, res) => {
    try {
        const reservas = await reservasModel.getAllReservas();
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Error en getAllReservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas', details: error.message });
    }
}

exports.getAllReservasPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const results = await reservasModel.getAllReservasPorUsuario(idUsuario);
        if (results.length === 0) {
            return res.status(404).json({ error: 'No hay reservas para este usuario' });
        }
        res.json(results);
        console.log('Reservas encontradas:', results);
    } catch (error) {
        console.error('Error en getAllReservasPorUsuario:', error);
        res.status(500).json({ error: 'Error al obtener reservas por usuario', details: error.message });
    }
}

exports.deleteReserva = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await reservasModel.deleteReserva(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error('Error en deleteReserva:', error);
        res.status(500).json({ error: 'Error al eliminar la reserva', details: error.message });
    }
}

exports.updateReservas = async (req, res) => {
    const { id } = req.params;
    const { FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado } = req.body;
    try {
        const [salas] = await db.query('SELECT * FROM salas WHERE ID_salas = ?', [FK_ID_salas]);
        if (salas.length === 0) {
            console.log('Sala no encontrada con ID:', FK_ID_salas);
            return res.status(404).json({ error: 'Sala no encontrada' });
        }
        const precioPorPersona = salas[0].precio;
        const precio_total = precioPorPersona * jugadores;

        console.log('Datos recibidos para actualización:', { id, FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total });

        const result = await reservasModel.updateReserva(id, FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva actualizada' });
    } catch (error) {
        console.error('Error en updateReservas:', error);
        res.status(500).json({ error: 'Error al actualizar reserva', details: error.message });
    }
}