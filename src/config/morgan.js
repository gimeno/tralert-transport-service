const morgan = require('morgan');
const { env } = require('./config');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => {
        return res.statusCode >= 400 || req.baseUrl === '/api-docs';
    },
    stream: { write: (message) => logger.info(message.trim()) }
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => {
        return res.statusCode < 400 || req.baseUrl === '/api-docs';
    },
    stream: { write: (message) => logger.error(message.trim()) }
});

module.exports = {
    successHandler,
    errorHandler
};
