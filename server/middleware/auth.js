const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"
    
    if (!token) {
        return res.status(403).json({ 
            error: 'Acceso denegado. Token no proporcionado.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token inválido o expirado.' 
        });
    }
}

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

function generarToken(usuario) {
    const payload = {
        id: usuario.ID_usuarios,
        mail: usuario.mail,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol || 'user'
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
    verificarToken,
    verificarAdmin,
    generarToken
};