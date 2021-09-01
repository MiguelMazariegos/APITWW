const express = require('express');
const dotentv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cargar el archivo de configuracion
dotentv.config({ path: './config/config.env'});

// Configuracion del passport para la autenticacion
require('./config/passport')(passport);

//Conectar a la base de datos en Mongo Atlas
connectDB();

const app = express();

// Documentacion con swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'RESTful API TVMaze',
            description: 'RESTful API de prueba tecnica para TWW',
            contact: {
                name: 'Miguel Mazariegos'
            }
        }
    },
    apis: [`${__dirname}/routes*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Body parser
app.use(express.urlencoded( {extended: false }));
app.use(express.json());

// Utilizar morgan para el login
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebar para las vistas
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessiones con express-session
app.use(session({
    secret: 'TWW',
    resave: false,
    saveUninitialized: false
}));

// Middleware para el passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)