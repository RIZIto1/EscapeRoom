const usuariosModel = require('../models/usuariosModel.js');
const bcrypt = require('bcryptjs');
const { generarToken } = require('../middleware/auth.js');

/**
 * POST /usuarios
 * Crear un nuevo usuario (registro)
 */
exports.crearUsuario = async (req, res) => {
  console.log('Solicitud recibida en crearUsuario:', req.body);
  const { nombre, apellido, telefono, mail, contrasenia } = req.body;
  console.log('Campos extraídos:', { nombre, apellido, telefono, mail, contrasenia });
  
  // Validaciones
  if (!nombre || !apellido || !telefono || !mail || !contrasenia) {
    console.log('Validación fallida. Campos faltantes');
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }
  
  if (!/\S+@\S+\.\S+/.test(mail)) {
    console.log('Validación fallida. Email inválido:', mail);
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  if (contrasenia.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar si el email ya existe
    const usuarioExistente = await usuariosModel.getUsuarioByEmail(mail);
    if (usuarioExistente.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(contrasenia, salt);

    // Crear usuario
    const result = await usuariosModel.setUsuario(nombre, apellido, telefono, mail, hashPassword);
    console.log('Resultado de la inserción:', result);
    
    if (!result || result.affectedRows === 0) {
      console.log('Error: No se insertó ningún usuario');
      return res.status(500).json({ error: 'Error al crear usuario' });
    }

    res.status(201).json({ 
      message: 'Usuario creado exitosamente', 
      id: result.insertId 
    });
    
  } catch (error) {
    console.error('Error en crearUsuario:', error);
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
};

/**
 * POST /usuarios/login
 * Iniciar sesión y obtener JWT
 */
exports.login = async (req, res) => {
  console.log('Solicitud recibida en login:', req.body);
  const { mail, contrasenia } = req.body;

  // Validaciones
  if (!mail || !contrasenia) {
    console.log('Validación fallida. Campos faltantes');
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Buscar usuario por email
    const users = await usuariosModel.getUsuarioByEmail(mail);
    console.log('Usuarios encontrados:', users);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = users[0];
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(contrasenia, user.contrasenia);

    if (!passwordValida) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = generarToken(user);
    console.log('Token generado exitosamente');

    // Devolver token y datos del usuario (sin la contraseña)
    res.json({ 
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: user.ID_usuarios,
        nombre: user.nombre,
        apellido: user.apellido,
        mail: user.mail,
        telefono: user.telefono,
        rol: user.rol
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login', details: error.message });
  }
};

/**
 * POST /usuarios/verificar-token
 * Verificar si un token es válido
 */
exports.verificarToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });
    }
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'HoLANFNDSOYJFTAISNJSDNLECHESFJ929383JBH';
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({ 
      valido: true, 
      usuario: decoded 
    });
    
  } catch (error) {
    res.status(401).json({ 
      valido: false, 
      error: 'Token inválido o expirado' 
    });
  }
};

/**
 * PUT /usuarios/:id/promover
 * Promover usuario a admin (SOLO ADMIN)
 */
exports.promoverUsuario = async (req, res) => {
  console.log('Solicitud recibida en promoverUsuario:', { user: req.user, params: req.params });
  
  // req.user viene del middleware verificarToken
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

/**
 * GET /usuarios/:mail
 * Obtener usuario por email (REQUIERE AUTENTICACIÓN)
 */
exports.getUsuarioByEmail = async (req, res) => {
  const { mail } = req.params;
  
  try {
    const users = await usuariosModel.getUsuarioByEmail(mail);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const user = users[0];
    
    // No devolver la contraseña
    delete user.contrasenia;
    
    res.json(user);
    console.log('Usuario encontrado:', user);
  } catch (error) {
    console.error('Error en getUsuarioByEmail:', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

/**
 * GET /usuarios
 * Obtener todos los usuarios (SOLO ADMIN)
 */
exports.getAllUsuarios = async (req, res) => {
  try {
    const users = await usuariosModel.getAllUsuarios();
    
    // Eliminar contraseñas de todos los usuarios
    const usuariosSinPassword = users.map(user => {
      const { contrasenia, ...usuarioSinPassword } = user;
      return usuarioSinPassword;
    });
    
    res.json(usuariosSinPassword);
    console.log('Usuarios encontrados:', usuariosSinPassword.length);
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

/**
 * DELETE /usuarios/:id
 * Eliminar usuario (SOLO ADMIN)
 */
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