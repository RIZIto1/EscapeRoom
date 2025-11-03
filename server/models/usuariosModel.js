const db = require ('../config/config.js');

exports.setUsuario = async (nombre, apellido, telefono, mail, contrasenia) => {
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, apellido, telefono, mail, contrasenia) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellido, telefono, mail, contrasenia]
  );
  return result;
};

exports.getUsuarioByEmail = async (mail) => {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE mail = ?', [mail]);
  return rows;
};

exports.getAllUsuarios = async () => {
  const [rows] = await db.query('SELECT * FROM usuarios');
  return rows;
}

exports.setRol = async (id, rol) => {
  const [result] = await db.query('UPDATE usuarios SET rol = ? WHERE ID_usuarios = ?', [rol, id]);
  return result;
};

exports.deleteUsuario = async (id) => {
  const [result] = await db.query('DELETE FROM usuarios WHERE ID_usuarios = ?', [id]);
  return result;  
};