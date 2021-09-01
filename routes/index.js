const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Comentario = require('../models/comentario');


/**
 * @swagger
 * components:
 *   schemas:
 *     comentario:
 *       type: object
 *       required:
 *         - showId
 *         - show
 *         - comentario
 *       properties:
 *         showId:
 *           type: string
 *           description: El id del show que se comenta
 *         show:
 *           type: string
 *           description: el nombre del show
 *         comentario:
 *           type: string
 *           description: el cuerpo del comentario escrito
 *       example: 
 *         showId: 1
 *         show: The Dome
 *         comentario: <p>Me gusta</p> 
 */

/**
 * @swagger
 * /api/shows:
 *   get:
 *     summary: Retorna la lista de todos los shows en la API de TVMaze
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           application/json:
 */
router.get('/api/shows', (req, res) => {
    // URI de la api de tvmaze
    const url = 'https://api.tvmaze.com/shows';

    // Realiza u
    const get_data = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log('Response OK');
            res.json(json);
        } catch (error) {
            console.error(error);
        }
    }
    get_data(url);
})


/**
 * @swagger
 * /api/shows/{id}:
 *   get:
 *     summary: Retorna el show con el id de la ruta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id del show de la api de TVMaze
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           application/json:
 *       400: 
 *         description: No se encontro show con este id
 * 
 */
router.get('/api/shows/:id(\\d+)', ensureAuth, (req, res) => {
    //
    let id_busqueda = req.params.id;
    // URI de la api de tvmaze
    const url = `https://api.tvmaze.com/shows/${id_busqueda}`;

    // Realiza u
    const get_data = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log('Response OK');
            res.json(json);
        } catch (error) {
            console.error(error);
        }
    }
    get_data(url);
})

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Retorna la vista para el login
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           layout:
 */
router.get('/api/login', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
})

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna la vista del dashboard
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           layout:
 */
router.get('/dashboard', ensureAuth,async (req, res) => {
    try {
        const comentarios = await Comentario.find({ user: req.user.id }).lean();
        console.log(comentarios);
        res.render('dashboard', {
            name: req.user.nombre,
            comentarios
        })
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})

/**
 * @swagger
 * /api/comentarios/{showId}:
 *   get:
 *     summary: muestra los comentarios almacenados en la base de datos con el id especificado
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           layout:
 *       400: 
 *         description: No se encontraron comentarios
 */
router.get('/api/comentarios/:showId(\\d+)', ensureAuth, async (req, res) => {
    try {
        const comentarios = await Comentario.find({ showId: req.params.showId }).lean();
        const json = await JSON.stringify(comentarios);
        console.log('Response OK');
        res.json(json);
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
})

/**
 * @swagger
 * /api/comentarios/add:
 *   get:
 *     summary: retorna la vista para agregar comentarios
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           layout:
 */
router.get('/api/comentarios/add', ensureAuth, (req, res) => {
    res.render('comentarios/add');
})

/**
 * @swagger
 * /api/comentarios/add:
 *   post:
 *     summary: metodo asincrono para crear un documento con el comentario de la serie indicada
 *     responses:
 *       200: 
 *         description: Se realiza la peticion exitosamente
 *         content:
 *           layout:
 *       400: 
 *         description: Error al crear comentario
 */
router.post('/api/comentarios/add', ensureAuth, async (req, res) => {
    try {
        // Si el id del show ingresado no es un numero
        if(isNaN(req.body.showId)) {
            res.send('ID del show no es un numero. Por favor verificar que sea un numero.');
        } else {
            // Almacena el id del usuario logueado para guardar el id en la db
            req.body.user = req.user.id;
            // Guarda el id del show seleccionado para buscarlo en la api de tvMaze
            let id_busqueda = req.body.showId;
            // URI de la api de tvmaze
            const url = `https://api.tvmaze.com/shows/${id_busqueda}`;

            // Realiza una busqueda en la api de tvMaze
            fetch(url)
            // Convierte la respuesta de la api de TVMaze en JSON
            .then(response => response.json())
            // realiza una insercion asincrona del comentario creado en la base de datos de mongo Atlas
            // luego redirige a la pagina principal
            .then(async (data) => {
                req.body.show = data.name;
                await Comentario.create(req.body);
                res.redirect('/dashboard');
            })
            .catch(err => console.error(err))
        }
        
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }

})

module.exports = router;