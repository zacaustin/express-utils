// Load Module Dependencies
const express = require('express');
const createError = require('http-errors');

// Load Library Modules
const {
    responseStructureMiddleware,
    notFoundController,
    errorController
} = require('..');

// Initialise Express App
const app = express();

// Middleware
app.use(express.json());
app.use(responseStructureMiddleware);

// Routes
app.get('/', (req, res, next) => {
    res.respond(200, { message: 'Welcome to Express Utils Example!' });
});

app.get('/error', (req, res, next) => {
    req.errors.push(createError('Sample Validation Error'));
    return next(createError(new Error('Simulated Server Error')));
});

// Not Found and Error Handlers
app.use(notFoundController);
app.use(errorController);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});