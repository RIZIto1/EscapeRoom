const jwt = require('jsonwebtoken');

// Cargar la clave secreta desde .env - SIN FALLBACK para mayor seguridad
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Middleware para verificar el token JWT
 * Uso: aplicar en rutas que requieran autenticación
 */
function verificarToken(req, res, next) {
    // Extraer token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"
    
    if (!token) {
        return res.status(403).json({ 
            error: 'Acceso denegado. Token no proporcionado.' 
        });
    }
    
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Agregar información del usuario a la request
        req.user = decoded;
        
        // Continuar con la siguiente función
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token inválido o expirado.' 
        });
    }
}

/**
 * Middleware para verificar si el usuario es administrador
 * Uso: aplicar después de verificarToken en rutas de admin
 */
function verificarAdmin(req, res, next) {
    if (!req.user) {
        return res.status(403).json({ 
            error: 'Usuario no autenticado.' 
        });
    }
    
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ 
            error: 'Acceso denegado. Solo administradores.' 
        });
    }
    
    next();
}

/**
 * Función para generar un token JWT
 * Uso: llamar al hacer login exitoso
 */
function generarToken(usuario) {
    const payload = {
        id: usuario.ID_usuarios,
        mail: usuario.mail,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol || 'user'
    };
    
    // Token válido por 24 horas
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
    verificarToken,
    verificarAdmin,
    generarToken
};