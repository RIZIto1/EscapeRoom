const mysql = require ("mysql2");
require('dotenv').config();

const credenciales = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'escaperoom2'
};

const db = mysql.createPool(credenciales);
module.exports = db.promise();