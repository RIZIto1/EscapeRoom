const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController.js');

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Gestión de horarios de salas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Horario:
 *       type: object
 *       required:
 *         - FK_ID_salas
 *         - dia
 *         - hora_inicio
 *         - hora_fin
 *       properties:
 *         ID_horarios:
 *           type: integer
 *           description: ID único del horario
 *         FK_ID_salas:
 *           type: integer
 *           description: ID de la sala asociada
 *         dia:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *           description: Día de la semana
 *         hora_inicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del horario (formato HH:MM:SS)
 *         hora_fin:
 *           type: string
 *           format: time
 *           description: Hora de fin del horario (formato HH:MM:SS)
 *       example:
 *         ID_horarios: 1
 *         FK_ID_salas: 1
 *         dia: "Lunes"
 *         hora_inicio: "14:00:00"
 *         hora_fin: "15:00:00"
 */

/**
 * @swagger
 * /horarios:
 *   post:
 *     summary: Crea un nuevo horario
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FK_ID_salas
 *               - dia
 *               - hora_inicio
 *               - hora_fin
 *             properties:
 *               FK_ID_salas:
 *                 type: integer
 *                 description: ID de la sala asociada
 *               dia:
 *                 type: string
 *                 enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *                 description: Día de la semana
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio del horario (formato HH:MM:SS)
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin del horario (formato HH:MM:SS)
 *           example:
 *             FK_ID_salas: 1
 *             dia: "Lunes"
 *             hora_inicio: "14:00:00"
 *             hora_fin: "15:00:00"
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 horarioId:
 *                   type: integer
 *               example:
 *                 message: "Horario creado"
 *                 horarioId: 1
 *       400:
 *         description: Campos obligatorios faltantes, día inválido o formato de hora inválido
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error al crear horario
 */
router.post('/', horariosController.crearHorario);

/**
 * @swagger
 * /horarios/getall:
 *   get:
 *     summary: Obtener todos los horarios
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Lista de horarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *             example:
 *               - ID_horarios: 1
 *                 FK_ID_salas: 1
 *                 dia: "Lunes"
 *                 hora_inicio: "14:00:00"
 *                 hora_fin: "15:00:00"
 *               - ID_horarios: 2
 *                 FK_ID_salas: 1
 *                 dia: "Martes"
 *                 hora_inicio: "16:00:00"
 *                 hora_fin: "17:00:00"
 *       500:
 *         description: Error al obtener horarios
 */
router.get('/getall', horariosController.getAllHorarios);

/**
 * @swagger
 * /horarios/sala/{salaId}:
 *   get:
 *     summary: Obtener horarios por ID de sala
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: salaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Lista de horarios para la sala
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *             example:
 *               - ID_horarios: 1
 *                 FK_ID_salas: 1
 *                 dia: "Lunes"
 *                 hora_inicio: "14:00:00"
 *                 hora_fin: "15:00:00"
 *               - ID_horarios: 2
 *                 FK_ID_salas: 1
 *                 dia: "Martes"
 *                 hora_inicio: "16:00:00"
 *                 hora_fin: "17:00:00"
 *       404:
 *         description: No hay horarios para esta sala
 *       500:
 *         description: Error al obtener horarios por sala
 */
router.get('/sala/:salaId', horariosController.getHorariosPorSala);

/**
 * @swagger
 * /horarios/getHorario/{id}:
 *   get:
 *     summary: Obtener un horario por ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *             example:
 *               ID_horarios: 1
 *               FK_ID_salas: 1
 *               dia: "Lunes"
 *               hora_inicio: "14:00:00"
 *               hora_fin: "15:00:00"
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error al obtener horario por ID
 */
router.get('/getHorario/:id', horariosController.getHorarioPorId);

/**
 * @swagger
 * /horarios/update/{id}:
 *   put:
 *     summary: Actualizar un horario por ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FK_ID_salas
 *               - dia
 *               - hora_inicio
 *               - hora_fin
 *             properties:
 *               FK_ID_salas:
 *                 type: integer
 *                 description: ID de la sala asociada
 *               dia:
 *                 type: string
 *                 enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *                 description: Día de la semana
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio del horario (formato HH:MM:SS)
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin del horario (formato HH:MM:SS)
 *           example:
 *             FK_ID_salas: 1
 *             dia: "Martes"
 *             hora_inicio: "16:00:00"
 *             hora_fin: "17:00:00"
 *     responses:
 *       200:
 *         description: Horario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Horario actualizado"
 *       400:
 *         description: Campos obligatorios faltantes, día inválido o formato de hora inválido
 *       404:
 *         description: Sala o horario no encontrado
 *       500:
 *         description: Error al actualizar horario
 */
router.put('/update/:id', horariosController.updateHorario);

/**
 * @swagger
 * /horarios/delete/{id}:
 *   delete:
 *     summary: Eliminar un horario por ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a eliminar
 *     responses:
 *       200:
 *         description: Horario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Horario eliminado"
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error al eliminar horario
 */
router.delete('/delete/:id', horariosController.deleteHorario);

module.exports = router;