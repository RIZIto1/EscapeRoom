const db = require ('../config/config.js');

exports.crearSala = async (nombre, capacidad, dificultad, tiempo, precio, imagen) => {
    const [result] = await db.query(
        'INSERT INTO salas (nombre, capacidad, dificultad, tiempo, precio, imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, capacidad, dificultad, tiempo, precio, imagen]
    );
    return result;
}

exports.getAllSalas = async () => {
    const [rows] = await db.query('SELECT * FROM salas');
    return rows;
}

exports.deleteSala = async (id) => {
    const [result] = await db.query('DELETE FROM salas WHERE ID_salas = ?', [id]);
    return result;  
}

exports.updateSala = async (id, nombre, capacidad, dificultad, tiempo, precio, imagen) => {
    const [result] = await db.query( 
        'UPDATE salas SET nombre = ?, capacidad = ?, dificultad = ?, tiempo = ?, precio = ?, imagen = ? WHERE ID_salas = ?',    
        [nombre, capacidad, dificultad, tiempo, precio, imagen, id]
    );
    return result;
}
