const errorController = require('../src/controllers/errorController');
const debug = require('debug')('exputil:errorController');

jest.mock('debug', () => jest.fn().mockReturnValue(jest.fn()));

describe('errorController Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            errors: []
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            respond: jest.fn()
        };

        next = jest.fn();
    });

    it('should use response.respond() when available', async () => {
        const error = new Error('Something went wrong');
        error.status = 400;

        errorController(error, req, res, next);

        expect(req.errors).toEqual([
            {
                message: 'Something went wrong',
                stack: process.env.NODE_ENV === 'development' ? error.stack : null
            }
        ]);

        expect(res.respond).toHaveBeenCalledWith(400, null, { successFlag: false });
        expect(res.status).not.toHaveBeenCalled(); // Should not use fallback JSON
    });

    it('should fallback to res.status().json() when response.respond is unavailable', async () => {
        delete res.respond; // Simulate no responseStructure middleware

        const error = new Error('Internal Server Error');
        error.status = 500;

        errorController(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 500,
            message: 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
    });

    it('should default status code to 500 if not provided', async () => {
        const error = new Error('Unknown Error');

        errorController(error, req, res, next);

        expect(res.respond).toHaveBeenCalledWith(500, null, { successFlag: false });
    });
});