const express = require('express');
const router = express.Router();
const salasController = require('../controllers/salasController.js');

/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gestión de salas de escape
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sala:
 *       type: object
 *       required:
 *         - nombre
 *         - capacidad
 *         - dificultad
 *         - tiempo
 *         - precio
 *       properties:
 *         ID_salas:
 *           type: integer
 *           description: ID único de la sala
 *         nombre:
 *           type: string
 *           description: Nombre de la sala
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de la sala
 *         dificultad:
 *           type: string
 *           description: Nivel de dificultad de la sala (por ejemplo, Fácil, Media, Difícil)
 *         tiempo:
 *           type: integer
 *           description: Tiempo límite para completar la sala (en minutos)
 *         precio:
 *           type: number
 *           description: Precio de la sala
 *       example:
 *         ID_salas: 1
 *         nombre: "Misterio del Bosque"
 *         capacidad: 6
 *         dificultad: "Media"
 *         tiempo: 60
 *         precio: 100.00
 */

/**
 * @swagger
 * /salas:
 *   post:
 *     summary: Crea una nueva sala
 *     tags: [Salas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sala'
 *           example:
 *             nombre: "Misterio del Bosque"
 *             capacidad: 6
 *             dificultad: "Media"
 *             tiempo: 60
 *             precio: 8000
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 salaId:
 *                   type: integer
 *               example:
 *                 message: "Sala creada"
 *                 ID_salas: 1
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', salasController.crearSala);

/**
 * @swagger
 * /salas/getall:
 *   get:
 *     summary: Obtener todas las salas
 *     tags: [Salas]
 *     responses:
 *       200:
 *         description: Lista de salas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sala'
 *             example:
 *               - ID_salas: 1
 *                 nombre: "Misterio del Bosque"
 *                 capacidad: 6
 *                 dificultad: "Media"
 *                 tiempo: 60
 *                 precio: 100.00
 *               - ID_salas: 2
 *                 nombre: "Aventura Pirata"
 *                 capacidad: 8
 *                 dificultad: "Alta"
 *                 tiempo: 60
 *                 precio: 15000
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getall', salasController.getAllSalas);

/**
 * @swagger
 * /salas/update/{id}:
 *   put:
 *     summary: Actualizar una sala por ID
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: ID_salas
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sala'
 *           example:
 *             nombre: "Aventura Pirata"
 *             capacidad: 8
 *             dificultad: "Alta"
 *             tiempo: 60
 *             precio: 10000
 *     responses:
 *       200:
 *         description: Sala actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Sala actualizada"
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update/:id', salasController.updateSala);

/**
 * @swagger
 * /salas/delete/{id}:
 *   delete:
 *     summary: Eliminar una sala por ID
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: ID_salas
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sala a eliminar
 *     responses:
 *       200:
 *         description: Sala eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Sala eliminada"
 *       404:
 *         description: Sala no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/delete/:id', salasController.deleteSala);

module.exports = router;