const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuariosRoutes.js');
const salasRoutes = require('./routes/salasRoutes.js');
const horariosRoutes = require('./routes/horariosRoutes.js');
const reservasRoutes = require('./routes/reservasRoutes.js');

const app = express();

app.use(express.json());
app.use('/documentacion', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/usuarios', usuariosRoutes);
app.use('/salas', salasRoutes);
app.use('/horarios', horariosRoutes);
app.use('/reservas', reservasRoutes);

module.exports = app;