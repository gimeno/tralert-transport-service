const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const { env } = require('./config/config');
const morgan = require('./config/morgan');

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

app.use('/', (req, res) => {
    res.send('Working');
});

module.exports = app;
