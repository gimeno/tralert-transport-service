const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
// const Joi = require('@hapi/joi');

const getTrains = {
    query: Joi.object().keys({
        from: Joi.string().required(),
        to: Joi.string().required(),
        departDate: Joi.date().utc().format('DD-MM-YYYY').greater('now').required(),
        returnDate: Joi.date().utc().format('DD-MM-YYYY').min(Joi.ref('departDate'))
    })
};

module.exports = {
    getTrains
};
