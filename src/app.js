const express = require('express');
const { env } = require('./config/config');
const morgan = require('./config/morgan');

const app = express();

if (env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

app.use('/', (req, res) => {
    res.send('Working');
});

module.exports = app;
