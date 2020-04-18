const httpStatus = require('http-status');

class ApiError extends Error {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({ message, stack, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.stack = stack;
    }
}

module.exports = ApiError;
