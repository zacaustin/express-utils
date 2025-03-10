// Configure Debugging
const debug = require('debug')('exputil:responseStructure');

// Load Module Depenedencies
const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to structure the response of an Express application.
 * 
 * @module responseStructure
 * @requires debug
 * @requires uuid
 * 
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * 
 * @returns {void}
 * 
 * @example
 * // Usage in an Express application
 * const express = require('express');
 * const responseStructure = require('./middleware/responseStructure');
 * 
 * const app = express();
 * app.use(responseStructure);
 * 
 * app.get('/', (req, res) => {
 *   res.respond(200, { message: 'Hello, world!' });
 * });
 * 
 * app.listen(3000, () => {
 *   console.log('Server is running on port 3000');
 * });
 */
module.exports = function responseStructure(request, response, next) {
    // Generate and Set RequestId
    request.requestId = uuidv4();
    debug('issued requestId: %s', request.requestId);

    // Create Array for Errors
    request.errors = [];
    debug('created errors array');

    /**
     * Respond method to structure and send the HTTP response.
     * 
     * @function respond
     * @memberof response
     * 
     * @param {number} statusCode - The HTTP status code to send.
     * @param {Object} responseData - The data to include in the response body.
     * @param {Object} [options] - Additional options for the response.
     * @param {boolean} [options.successFlag] - Flag indicating the success of the response.
     * 
     * @returns {Promise<Object>} A promise that resolves with the structured response data.
     * 
     * @throws {Error} If an error occurs while structuring the response.
     * 
     * @example
     * res.respond(200, { message: 'Success' });
     */
    response.respond = async function respond(statusCode, responseData, options) {
        debug('respond method called');
        return new Promise((resolve, reject) => {
            try {
                // Validate HTTP Status Code
                statusCode = Number.isInteger(statusCode) ? statusCode : 200;
                debug('status code: %d', statusCode);
                options = typeof options === 'object' ? options : {}
                options.successFlag = typeof options.successFlag === 'boolean' ? options.successFlag : (statusCode >= 200 && statusCode < 300);
                debug('success flag: %s', options.successFlag);

                // Structure Response
                const data = {
                    requestId: request.requestId,
                    status: statusCode,
                    success: options.successFlag,
                    errors: Array.isArray(request.errors) ? request.errors : [],
                    data: responseData
                }
                debug('response data:', data);

                // Issue Response
                response.status(statusCode).json(data);
                debug('sent response');

                // Resolve Promise
                return resolve(data);
            } catch (error) {
                debug('error responding: %s', error.message);
                return reject(error);
            }
        });
    }

    // Continue Processing
    debug('responseStructure middleware complete');
    return next();
}