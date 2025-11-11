const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController.js');
const { verificarToken, verificarAdmin } = require('../middleware/auth.js');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y autenticación
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *         nombre: Juan
 *         apellido: Pérez
 *         telefono: "1140430332"
 *         mail: "juan@gmail.com"
 *         rol: "user"
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - telefono
 *               - mail
 *               - contrasenia
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               mail:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *             example:
 *               nombre: Juan
 *               apellido: Pérez
 *               telefono: "1140430332"
 *               mail: "juan@gmail.com"
 *               contrasenia: "password123"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes o inválidos
 *       409:
 *         description: Email ya registrado
 */
router.post('/', usuariosController.crearUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Inicia sesión y obtiene token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mail
 *               - contrasenia
 *             properties:
 *               mail:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *             example:
 *               mail: "juan@gmail.com"
 *               contrasenia: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', usuariosController.login);

// /**
//  * @swagger
//  * /usuarios/verificar-token:
//  *   post:
//  *     summary: Verifica si un token JWT es válido
//  *     tags: [Usuarios]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - token
//  *             properties:
//  *               token:
//  *                 type: string
//  *                 description: Token JWT a verificar
//  *             example:
//  *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//  *     responses:
//  *       200:
//  *         description: Token válido
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 valido:
//  *                   type: boolean
//  *                   example: true
//  *                 usuario:
//  *                   type: object
//  *                   description: Datos decodificados del usuario
//  *       401:
//  *         description: Token inválido o expirado
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 valido:
//  *                   type: boolean
//  *                   example: false
//  *                 error:
//  *                   type: string
//  *                   example: "Token inválido o expirado"
//  */
// router.post('/verificar-token', usuariosController.verificarToken);

/**
 * @swagger
 * /usuarios/getall:
 *   get:
 *     summary: Obtiene todos los usuarios (sin contraseñas)
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
 */
router.get('/getall', usuariosController.getAllUsuarios);

/**
 * @swagger
 * /usuarios/{mail}:
 *   get:
 *     summary: Obtiene un usuario por su email (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mail
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario
 *         example: "juan@gmail.com"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:mail', verificarToken, usuariosController.getUsuarioByEmail);

/**
 * @swagger
 * /usuarios/rol/{id}:
 *   put:
 *     summary: Promueve un usuario a admin (solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: No autorizado, solo administradores
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/rol/:id', verificarToken, verificarAdmin, usuariosController.promoverUsuario);

/**
 * @swagger
 * /usuarios/delete/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID (solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: No autorizado, solo administradores
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/delete/:id', verificarToken, verificarAdmin, usuariosController.deleteUsuario);

module.exports = router;