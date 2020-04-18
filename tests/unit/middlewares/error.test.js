const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const { converter, handler, routeNotFound } = require('../../../src/middlewares/error');
const ApiError = require('../../../src/utils/ApiError');

describe('Error middlewares', () => {
    let next;
    beforeAll(() => {
        next = jest.fn();
    });

    describe('Error converter', () => {
        test('should return the same ApiError object it was called with', () => {
            const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');

            converter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        test('should convert an Error to ApiError and preserve its status and message', () => {
            const error = new Error('Any error');
            error.status = httpStatus.BAD_REQUEST;

            converter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: error.status,
                    message: error.message,
                    isPublic: false
                })
            );
        });

        test('should convert an Error without status to ApiError with status 500', () => {
            const error = new Error('Any error');

            converter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    isPublic: false
                })
            );
        });

        test('should convert an Error without message to ApiError with default message of that http status', () => {
            const error = new Error();
            error.status = httpStatus.BAD_REQUEST;

            converter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: error.status,
                    message: httpStatus[error.status],
                    isPublic: false
                })
            );
        });

        test('should convert any other object to ApiError with status 500 and its message', () => {
            const error = {};

            converter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
                    isPublic: false
                })
            );
        });
    });

    describe('Error handler', () => {
        test('should send proper error response and put the error message in res.locals if there is no stack', () => {
            const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
            const res = httpMocks.createResponse();
            const sendSpy = jest.spyOn(res, 'json');

            handler(error, httpMocks.createRequest(), res);

            expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ code: error.status, message: error.message }));
            expect(res.locals.errorMessage).toBe(error.message);
        });

        test('should send proper error response and put the error stack in res.locals if there is stack', () => {
            const error = new ApiError(httpStatus.BAD_REQUEST, 'Any error');
            error.stack = 'Stack test';
            const res = httpMocks.createResponse();
            const sendSpy = jest.spyOn(res, 'json');

            handler(error, httpMocks.createRequest(), res);

            expect(sendSpy).toHaveBeenCalledWith(
                expect.objectContaining({ code: error.status, message: error.message, stack: error.stack })
            );
            expect(res.locals.errorMessage).toBe(error.stack);
        });
    });

    describe('Error Route Not Found', () => {
        test('should send proper error message Not Found and status 404', () => {
            routeNotFound(httpMocks.createRequest(), httpMocks.createResponse, next);

            expect(next).toHaveBeenCalledWith(expect.any(ApiError));
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: httpStatus.NOT_FOUND,
                    message: httpStatus[httpStatus.NOT_FOUND],
                    isPublic: false
                })
            );
        });
    });
});
