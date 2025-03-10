// Configure Debugging
const debug = require('debug')('exputil:errorController');

/**
 * Error handling controller for Express.
 *
 * @param {Object} error - The error object.
 * @param {Object} request - The Express request object.
 * @param {Object} response - The Express response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {void}
 */
module.exports = function errorController(error, request, response, next) {
    // Determine Status Code
    const statusCode = error.status || 500;
    debug('status code: %d', statusCode);

    // Use responseStructure API if available
    if (Array.isArray(request.errors) && typeof response.respond === 'function') {
        debug('detected responseStructure middleware. using res.respond().');
        // Push error to errors array
        request.errors.push({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });

        // Send Response
        return response.respond(statusCode, null, { successFlag: false });
    } else {
        debug('did not detect responseStructure middleware. using res.status().json().');
        // Return JSON 
        response.status(statusCode).json({
            status: error.status || 500,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
    }
}