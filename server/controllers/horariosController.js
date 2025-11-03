const horariosModel = require('../models/horariosModel.js');
const salasModel = require('../models/salasModel.js');
const db = require('../config/config.js');

exports.crearHorario = async (req, res) => {
  console.log('Solicitud recibida en crearHorario:', req.body);
  const { FK_ID_salas, dia, hora_inicio, hora_fin } = req.body;
  console.log('Campos extraídos:', { FK_ID_salas, dia, hora_inicio, hora_fin });

  if (!FK_ID_salas || !dia || !hora_inicio || !hora_fin) {
    console.log('Validación fallida. Campos faltantes:', { FK_ID_salas, dia, hora_inicio, hora_fin });
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  if (!diasValidos.includes(dia)) { 
    console.log('Validación fallida. Día inválido:', dia);
    return res.status(400).json({ error: 'Día inválido. Debe ser Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo' });
  }

  if (!/^\d{2}:\d{2}:\d{2}$/.test(hora_inicio) || !/^\d{2}:\d{2}:\d{2}$/.test(hora_fin)) {
    console.log('Validación fallida. Formato de hora inválido:', { hora_inicio, hora_fin });
    return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM:SS' });
  }

  try {
    const salas = await salasModel.getAllSalas();
    if (!salas.find(sala => sala.ID_salas === parseInt(FK_ID_salas))) {
      console.log('Validación fallida. Sala no encontrada:', FK_ID_salas);
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    const result = await horariosModel.crearHorario(FK_ID_salas, dia, hora_inicio, hora_fin);
    console.log('Resultado de crearHorario:', result);
    res.status(201).json({ message: 'Horario creado', horarioId: result.insertId });
  } catch (error) {
    console.error('Error en crearHorario:', error);
    res.status(500).json({ error: 'Error al crear horario', details: error.message });
  }
};


exports.getAllHorarios = async (req, res) => {
  try {
    const horarios = await horariosModel.getAllHorarios();
    res.status(200).json(horarios);
  } catch (error) {
    console.error('Error en getAllHorarios:', error);
    res.status(500).json({ error: 'Error al obtener horarios', details: error.message });
  }
};

exports.updateHorario = async (req, res) => {
  const { id } = req.params;
  const { FK_ID_salas, dia, hora_inicio, hora_fin } = req.body;
  console.log('Solicitud recibida en updateHorario:', { id, FK_ID_salas, dia, hora_inicio, hora_fin });

  if (!FK_ID_salas || !dia || !hora_inicio || !hora_fin) {
    console.log('Validación fallida. Campos faltantes:', { FK_ID_salas, dia, hora_inicio, hora_fin });
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  if (!diasValidos.includes(dia)) {
    console.log('Validación fallida. Día inválido:', dia);
    return res.status(400).json({ error: 'Día inválido. Debe ser Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo' });
  }

  if (!/^\d{2}:\d{2}:\d{2}$/.test(hora_inicio) || !/^\d{2}:\d{2}:\d{2}$/.test(hora_fin)) {
    console.log('Validación fallida. Formato de hora inválido:', { hora_inicio, hora_fin });
    return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM:SS' });
  }

  try {
    const salas = await salasModel.getAllSalas();
    if (!salas.find(sala => sala.ID_salas === parseInt(FK_ID_salas))) {
      console.log('Validación fallida. Sala no encontrada:', FK_ID_salas);
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    const result = await horariosModel.updateHorario(id, FK_ID_salas, dia, hora_inicio, hora_fin);
    console.log('Resultado de updateHorario:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json({ message: 'Tabla actualizada' });
  } catch (error) {
    console.error('Error en updateHorario:', error);
    res.status(500).json({ error: 'Error al actualizar horario', details: error.message });
  }
};

exports.deleteHorario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await horariosModel.deleteHorario(id);
    console.log('Resultado de deleteHorario:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json({ message: 'Horario eliminado' });
  } catch (error) {
    console.error('Error en deleteHorario:', error);
    res.status(500).json({ error: 'Error al eliminar horario', details: error.message });
  }
};

exports.getHorariosPorSala = async (req, res) => {
  const { salaId } = req.params;
  try {
    const horarios = await horariosModel.getHorariosPorSala(salaId);
    res.status(200).json(horarios);
  } catch (error) {
    console.error('Error en getHorariosPorSala:', error);
    res.status(500).json({ error: 'Error al obtener horarios por sala', details: error.message });
  }
};

exports.getHorarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const horario = await horariosModel.getHorarioPorId(id);
    if (!horario || horario.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.status(200).json(horario[0]);
  } catch (error) {
    console.error('Error en getHorarioPorId:', error);
    res.status(500).json({ error: 'Error al obtener horario por ID', details: error.message });
  }
};