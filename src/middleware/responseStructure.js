

// Configure Debugging
const debug = require('debug')('em:responseStructure');

// Load Module Depenedencies
const { v4: uuidv4 } = require('uuid');

module.exports = function responseStructure(request, response, next) {
    // Generate and Set RequestId
    request.requestId = uuidv4();

    // Create Array for Errors
    request.errors = [];

    // Create Respond Function
    response.respond = async function respond(statusCode, responseData, options) {
        return new Promise((resolve, reject) => {
            try {
                // Validate HTTP Status Code
                statusCode = Number.isInteger(statusCode) ? statusCode : 200;
                options = typeof options === 'object' ? options : {}
                options.successFlag = typeof options.successFlag === 'boolean' ? options.successFlag : (statusCode >= 200 && statusCode < 300);

                // Structure Response
                const data = {
                    requestId: request.requestId,
                    status: statusCode,
                    success: options.successFlag,
                    errors: Array.isArray(request.errors) ? request.errors : [],
                    data: responseData
                }

                // Issue Response
                response.status(statusCode).json(data);

                // Resolve Promise
                return resolve(data);
            } catch (error) {
                return reject(error);
            }
        });
    }

    // Continue Processing
    return next();
}