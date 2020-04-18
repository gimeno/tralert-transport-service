const { createLogger, transports, format } = require('winston');
const { env } = require('./config');

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const commonFormat = format.combine(
    enumerateErrorFormat(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.splat(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info',
    transports: [
        new transports.Console({
            stderrLevels: ['error'],
            format: format.combine(env === 'development' ? format.colorize() : format.uncolorize(), commonFormat)
        }),
        new transports.File({
            level: 'info',
            filename: './logs/app.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: commonFormat
        })
    ]
});

module.exports = logger;
