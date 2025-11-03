const db = require('../config/config.js');

exports.crearHorario = async (FK_ID_salas, dia, hora_inicio, hora_fin) => {
    const [result] = await db.query(
        'INSERT INTO horarios (FK_ID_salas, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
        [FK_ID_salas, dia, hora_inicio, hora_fin]
    );
    return result;
}

exports.getAllHorarios = async () => {
    const [rows] = await db.query('SELECT * FROM horarios');
    return rows;
}

exports.updateHorario = async (ID_horarios, FK_ID_salas, dia, hora_inicio, hora_fin) => {
    const [result] = await db.query(
        'UPDATE horarios SET FK_ID_salas = ?, dia = ?, hora_inicio = ?, hora_fin = ? WHERE ID_horarios = ?',
        [FK_ID_salas, dia, hora_inicio, hora_fin, ID_horarios]
    );
    return result;
}

exports.deleteHorario = async (id) => {
    const [result] = await db.query('DELETE FROM horarios WHERE ID_horarios = ?', [id]);
    return result;
}

exports.getHorariosPorSala = async (salaId) => {
    const [rows] = await db.query('SELECT * FROM horarios WHERE FK_ID_salas = ?', [salaId]);
    return rows;
}

exports.getHorarioPorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM horarios WHERE ID_horarios = ?', [id]);
    return rows;
}