const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const passport = require('passport');

/**
 * @swagger
 * /auth/google:
 * get:
 *  description: Autenticar con google
 *  respones:
 *      '200':
 *          description: Respuesta exitosa
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @descripcion Pagina de retorno despues de la autenticacion con google
// @ruta GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
(req, res) => {
    res.redirect('/api/login');
})

// @descripcion Salir de la sesion
// @ruta GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout('/api/login');
    res.redirect('/api/login');
})


module.exports = router;