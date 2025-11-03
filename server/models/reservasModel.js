const db = require ('../config/config.js');

exports.crearReserva = async (FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total) => {
    const [result] = await db.query(
        'INSERT INTO reservas (FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total]
    );
    return result;
}

exports.getAllReservas = async () => {
    const [rows] = await db.query('SELECT * FROM reservas');
    return rows;
}

exports.getAllReservasPorUsuario = async (FK_ID_usuarios) => {
    const [rows] = await db.query('SELECT * FROM reservas WHERE FK_ID_usuarios = ?', [FK_ID_usuarios]);
    return rows;
}

exports.deleteReserva = async (ID_reservas) => {
    const [result] = await db.query('DELETE FROM reservas WHERE ID_reservas = ?', [ID_reservas]);
    return result;
}

exports.updateReserva = async (ID_reservas, FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total) => {
    const [result] = await db.query( 
        'UPDATE reservas SET FK_ID_horarios = ?, FK_ID_salas = ?, FK_ID_usuarios = ?, fecha = ?, jugadores = ?, estado = ?, precio_total = ? WHERE ID_reservas = ?', 
    [FK_ID_horarios, FK_ID_salas, FK_ID_usuarios, fecha, jugadores, estado, precio_total, ID_reservas]);
        
    return result;
}