const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController.js');

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gestión de reservas de salas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - FK_ID_horarios
 *         - FK_ID_salas
 *         - FK_ID_usuarios
 *         - fecha
 *         - jugadores
 *         - estado
 *       properties:
 *         ID_reservas:
 *           type: integer
 *           description: ID único de la reserva
 *         FK_ID_horarios:
 *           type: integer
 *           description: ID del horario asociado
 *         FK_ID_salas:
 *           type: integer
 *           description: ID de la sala asociada
 *         FK_ID_usuarios:
 *           type: integer
 *           description: ID del usuario que realiza la reserva
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva (formato YYYY-MM-DD)
 *         jugadores:
 *           type: integer
 *           description: Cantidad de jugadores para la reserva
 *         estado:
 *           type: string
 *           enum: [ocupado, disponible, cancelado]
 *           description: Estado de la reserva
 *         precio_total:
 *           type: number
 *           description: Precio total de la reserva (calculado automáticamente)
 *       example:
 *         ID_reservas: 1
 *         FK_ID_horarios: 1
 *         FK_ID_salas: 2
 *         FK_ID_usuarios: 3
 *         fecha: "2025-09-08"
 *         jugadores: 4
 *         estado: "ocupado"
 *         precio_total: 320.00
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FK_ID_horarios
 *               - FK_ID_salas
 *               - FK_ID_usuarios
 *               - fecha
 *               - jugadores
 *               - estado
 *             properties:
 *               FK_ID_horarios:
 *                 type: integer
 *                 description: ID del horario asociado
 *               FK_ID_salas:
 *                 type: integer
 *                 description: ID de la sala asociada
 *               FK_ID_usuarios:
 *                 type: integer
 *                 description: ID del usuario que realiza la reserva
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la reserva (formato YYYY-MM-DD)
 *               jugadores:
 *                 type: integer
 *                 description: Cantidad de jugadores para la reserva
 *               estado:
 *                 type: string
 *                 enum: [ocupado, disponible, cancelado]
 *                 description: Estado de la reserva
 *           example:
 *             FK_ID_horarios: 1
 *             FK_ID_salas: 2
 *             FK_ID_usuarios: 3
 *             fecha: "2025-09-08"
 *             jugadores: 4
 *             estado: "ocupado"
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ID_reservas:
 *                   type: integer
 *               example:
 *                 message: "Reserva creada exitosamente"
 *                 ID_reservas: 1
 *       400:
 *         description: Campos obligatorios faltantes
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error al crear reserva
 */
router.post('/', reservasController.crearReserva);

/**
 * @swagger
 * /reservas/getall:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *             example:
 *               - ID_reservas: 1
 *                 FK_ID_horarios: 1
 *                 FK_ID_salas: 2
 *                 FK_ID_usuarios: 3
 *                 fecha: "2025-09-08"
 *                 jugadores: 4
 *                 estado: "ocupado"
 *                 precio_total: 320.00
 *               - ID_reservas: 2
 *                 FK_ID_horarios: 2
 *                 FK_ID_salas: 2
 *                 FK_ID_usuarios: 4
 *                 fecha: "2025-09-10"
 *                 jugadores: 2
 *                 estado: "disponible"
 *                 precio_total: 160.00
 *       500:
 *         description: Error al obtener reservas
 */
router.get('/getall', reservasController.getAllReservas);

/**
 * @swagger
 * /reservas/getall/{idUsuario}:
 *   get:
 *     summary: Obtener todas las reservas por ID de usuario
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas por usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *             example:
 *               - ID_reservas: 1
 *                 FK_ID_horarios: 1
 *                 FK_ID_salas: 2
 *                 FK_ID_usuarios: 3
 *                 fecha: "2025-09-08"
 *                 jugadores: 4
 *                 estado: "ocupado"
 *                 precio_total: 320.00
 *       404:
 *         description: No hay reservas para este usuario
 *       500:
 *         description: Error al obtener reservas por usuario
 */
router.get('/getall/:idUsuario', reservasController.getAllReservasPorUsuario);

/**
 * @swagger
 * /reservas/update/{id}:
 *   put:
 *     summary: Actualizar una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FK_ID_horarios
 *               - FK_ID_salas
 *               - FK_ID_usuarios
 *               - fecha
 *               - jugadores
 *               - estado
 *             properties:
 *               FK_ID_horarios:
 *                 type: integer
 *                 description: ID del horario asociado
 *               FK_ID_salas:
 *                 type: integer
 *                 description: ID de la sala asociada
 *               FK_ID_usuarios:
 *                 type: integer
 *                 description: ID del usuario que realiza la reserva
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la reserva (formato YYYY-MM-DD)
 *               jugadores:
 *                 type: integer
 *                 description: Cantidad de jugadores para la reserva
 *               estado:
 *                 type: string
 *                 enum: [ocupado, disponible, cancelado]
 *                 description: Estado de la reserva
 *           example:
 *             FK_ID_horarios: 1
 *             FK_ID_salas: 2
 *             FK_ID_usuarios: 3
 *             fecha: "2025-09-08"
 *             jugadores: 4
 *             estado: "ocupado"
 *     responses:
 *       200:
 *         description: Reserva actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Reserva actualizada"
 *       400:
 *         description: Campos obligatorios faltantes
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al actualizar reserva
 */
router.put('/update/:id', reservasController.updateReservas);

/**
 * @swagger
 * /reservas/delete/{id}:
 *   delete:
 *     summary: Eliminar una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Reserva eliminada"
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al eliminar reserva
 */
router.delete('/delete/:id', reservasController.deleteReserva);

module.exports = router;