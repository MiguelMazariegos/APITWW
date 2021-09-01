const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const passport = require('passport');

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       required:
 *         - googleId
 *         - displayName
 *         - nombre
 *         - apellido
 *       properties:
 *         googleId:
 *           type: string
 *           description: El id de usuario de google +
 *         displayName:
 *           type: string
 *           description: propiedad que contiene el nombre completo
 *         nombre:
 *           type: string
 *           description: propiedad que incluye el nombre
 *         apellido:
 *           type: string
 *           description: propiedad que incluye el apellido
 *       example: 
 *         googleId: 321hjhj2313jj21
 *         displayName: Mario Rodriguez 
 *         nombre: Mario 
 *         apellido: Rodriguez
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Llama al passport para autenticar con google
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           passport.authenticate:
 *       400: 
 *         description: Conexion fallida con la API de Google+
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Despues de autenticar con la API de Google redirige con callback
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           passport.authenticate:
 *       400: 
 *         description: Conexion fallida con la API de Google+
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
(req, res) => {
    res.redirect('/api/login');
})

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Cerrar sesion
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           redirect:
 */
router.get('/logout', (req, res) => {
    req.logout('/api/login');
    res.redirect('/api/login');
})


module.exports = router;