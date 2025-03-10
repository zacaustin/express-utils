const createError = require('http-errors');
const notFoundHandler = (request, response, next) => { return next(createError(404, 'Not Found')); };
module.exports = notFoundHandler;