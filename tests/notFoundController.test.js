const { notFoundController } = require('..');

describe('notFoundController Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
    });

    it('should call next with a 404 Not Found error', () => {
        notFoundController(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));

        const error = next.mock.calls[0][0]; // Get the first argument passed to next()
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(404);
        expect(error.message).toBe('Not Found');
    });
});