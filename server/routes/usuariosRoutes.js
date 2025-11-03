const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController.js');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - telefono
 *         - mail
 *         - contrasenia
 *       properties:
 *         ID_usuarios:
 *           type: integer
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario
 *         mail:
 *           type: string
 *           description: Email del usuario
 *         contrasenia:
 *           type: string
 *           description: Contraseña del usuario (hasheada)
 *         rol:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario
 *       example:
 *         ID_usuarios: 1
 *         nombre: Tais
 *         apellido: Leyes
 *         telefono: "123456789"
 *         mail: "tais093@gmail.com"
 *         contrasenia: "password123"
 *         rol: "user"
 *
 *     Login:
 *       type: object
 *       required:
 *         - mail
 *         - contrasenia
 *       properties:
 *         mail:
 *           type: string
 *           description: Email del usuario
 *         contrasenia:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         mail: "tais093@gmail.com"
 *         contrasenia: "password123"
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nombre: Tais
 *               apellido: Leyes
 *               telefono: "123456789"
 *               mail: "tais093@gmail.com"
 *               contrasenia: "taisleches"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *               example:
 *                 message: "Usuario creado"
 *                 id: 5
 *       400:
 *         description: Campos obligatorios faltantes o email inválido
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/', usuariosController.crearUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               mail: "tais093@gmail.com"
 *               contrasenia: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', usuariosController.login);

/**
 * @swagger
 * /usuarios/getall:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error en el servidor
 */
router.get('/getall', usuariosController.getAllUsuarios);

/**
 * @swagger
 * /usuarios/rol/{id}:
 *   put:
 *     summary: Promueve un usuario a admin
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a promover
 *     responses:
 *       200:
 *         description: Usuario promovido a admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Usuario promovido a admin"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/rol/:id', usuariosController.promoverUsuario);

/**
 * @swagger
 * /usuarios/delete/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Usuario eliminado"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/delete/:id', usuariosController.deleteUsuario);

module.exports = router;
