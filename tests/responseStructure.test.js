const responseStructure = require('../src/middleware/responseStructure');


jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid'),
}));

describe('responseStructure Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should assign a requestId and initialize errors array', () => {
        responseStructure(req, res, next);

        expect(req.requestId).toBe('mocked-uuid');
        expect(req.errors).toEqual([]);
        expect(next).toHaveBeenCalled();
    });

    it('should attach a respond function to response', async () => {
        responseStructure(req, res, next);

        expect(typeof res.respond).toBe('function');

        const responseData = { message: 'Success' };
        await res.respond(200, responseData);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            requestId: 'mocked-uuid',
            status: 200,
            success: true,
            errors: [],
            data: responseData
        });
    });

    it('should handle error responses correctly', async () => {
        responseStructure(req, res, next);

        req.errors.push('Some error');

        const responseData = null;
        await res.respond(400, responseData);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            requestId: 'mocked-uuid',
            status: 400,
            success: false,
            errors: ['Some error'],
            data: responseData
        });
    });

    it('should default to successFlag based on statusCode', async () => {
        responseStructure(req, res, next);

        await res.respond(201, { data: 'Created' });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

        await res.respond(400, { data: 'Bad Request' });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should respect explicit successFlag in options', async () => {
        responseStructure(req, res, next);

        await res.respond(500, { data: 'Internal Error' }, { successFlag: true });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

        await res.respond(200, { data: 'OK' }, { successFlag: false });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
});