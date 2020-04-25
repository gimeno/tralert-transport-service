const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').default('production'),
        PORT: Joi.number().default(5000),
        CHROMIUM_PATH: Joi.string().default(''),
        LOGS_TOKEN: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.optional() })
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    chromiumPath: envVars.CHROMIUM_PATH,
    logsToken: envVars.LOGS_TOKEN
};
