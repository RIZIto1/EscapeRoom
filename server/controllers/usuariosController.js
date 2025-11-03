const usuariosModel = require('../models/usuariosModel.js');
const db = require('../config/config.js');
const bcrypt = require ('bcryptjs');

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';


exports.crearUsuario = async (req, res) => {
  console.log('Solicitud recibida en crearUsuario:', req.body);
  const { nombre, apellido, telefono, mail, contrasenia } = req.body;
  console.log('Campos extraídos:', { nombre, apellido, telefono, mail, contrasenia });
  

  if (!nombre || !apellido || !telefono || !mail || !contrasenia) {
    console.log('Validación fallida. Campos faltantes:', { nombre, apellido, telefono, mail, contrasenia });
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }
  if (!/\S+@\S+\.\S+/.test(mail)) {
    console.log('Validación fallida. Email inválido:', mail);
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(contrasenia, salt);

  try {
    const result = await usuariosModel.setUsuario(nombre, apellido, telefono, mail, hashPassword, 'user');
    console.log('Resultado de la inserción:', result);
    if (!result || typeof result.affectedRows !== 'number') {
      console.log('Error: Resultado inválido:', result);
      return res.status(500).json({ error: 'Resultado de la base de datos inválido' });
    }
    if (result.affectedRows === 0) {
      console.log('Error: No se insertó ningún usuario');
      return res.status(500).json({ error: 'Error al crear usuario' });
    }
    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
  } catch (error) {
    console.error('Error en crearUsuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
};

exports.login = async (req, res) => {
  console.log('Solicitud recibida en login:', req.body);
  const { mail, contrasenia } = req.body;
  console.log('Campos extraídos:', { mail, contrasenia });

  if (!mail || !contrasenia) {
    console.log('Validación fallida. Campos faltantes:', { mail, contrasenia });
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    const users = await usuariosModel.getUsuarioByEmail(mail);
    console.log('Usuarios encontrados:', users);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = users[0];
    const cont = await bcrypt.compare(contrasenia, user.contrasenia);

    if (!cont) {
      console.log('Usuario o contraseña incorrectos');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({ message: 'Login exitoso', usuario: user });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login', details: error.message });
  }
};

exports.promoverUsuario = async (req, res) => {
  console.log('Solicitud recibida en promoverUsuario:', { user: req.user, params: req.params });
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado, solo administradores' });
  }
  const { id } = req.params;

  try {
    const result = await usuariosModel.setRol(id, 'admin');
    console.log('Resultado de promoverUsuario:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario promovido a admin' });
  } catch (error) {
    console.error('Error en promoverUsuario:', error);
    res.status(500).json({ error: 'Error al promover usuario', details: error.message });
  }
};

exports.getUsuarioByEmail = async (req, res) => {
  const { mail } = req.params;
  try {
    const users = await usuariosModel.getUsuarioByEmail(mail);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(users[0]);
    console.log('Usuario encontrado:', users[0]);
  } catch (error) {
    console.error('Error en getUsuarioByEmail:', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

exports.getAllUsuarios = async (req, res) => {
  try {
    const users = await usuariosModel.getAllUsuarios();
    res.json(users);
    console.log('Usuarios encontrados:', users);
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

exports.deleteUsuario = async (req, res) => {
  console.log('Solicitud recibida en deleteUsuario:', { user: req.user, params: req.params });
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado, solo administradores' });
  }
  const { id } = req.params;

  try {
    const result = await usuariosModel.deleteUsuario(id);
    console.log('Resultado de deleteUsuario:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};
