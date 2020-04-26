const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const routes = require('./routes');
const { env, port } = require('./config/config');
const morgan = require('./config/morgan');
const error = require('./middlewares/error');

const app = express();

if (env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options('*', cors());

// Api routes
app.use(routes);

app.use('/ok', (req, res) => {
    res.send('Working');
});

// swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger'
    },
    host: `localhost:${port}`,
    basePath: '/'
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition,
    // path to the API docs
    apis: ['src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// catch 404 and forward to error handler
app.use(error.routeNotFound);

// convert error to ApiError, if needed
app.use(error.converter);

// handle error
app.use(error.handler);

module.exports = app;
