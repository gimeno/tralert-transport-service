const winston = require('winston');
const Logsene = require('winston-logsene');
const { env, logsToken } = require('./config');

const commonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.splat(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [
    new winston.transports.Console({
        stderrLevels: ['error'],
        format: winston.format.combine(
            env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
            commonFormat
        )
    }),
    new winston.transports.File({
        level: 'info',
        filename: './logs/app.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: commonFormat
    })
];

if (env === 'production') {
    transports.push(
        new Logsene({
            token: logsToken,
            url: 'https://logsene-receiver.eu.sematext.com/_bulk'
        })
    );
}

const logger = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info',
    transports
});

module.exports = logger;
