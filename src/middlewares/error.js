const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const handler = (err, req, res, next) => {
    const response = {
        message: err.message,
        stack: err.stack
    };

    res.locals.errorMessage = response.stack || response.message;

    res.status(err.status);
    res.json(response);
};

const converter = (err, req, res, next) => {
    let convertedError = err;

    if (!(err instanceof ApiError)) {
        convertedError = new ApiError({
            message: err.message,
            status: err.status,
            stack: err.stack
        });
    }

    return next(convertedError);
};

const routeNotFound = (req, res, next) => {
    const err = new ApiError({ status: httpStatus.NOT_FOUND });
    return next(err);
};

module.exports = {
    handler,
    converter,
    routeNotFound
};
