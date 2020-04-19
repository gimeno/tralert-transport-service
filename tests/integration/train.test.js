const request = require('supertest');
const httpStatus = require('http-status');
const moment = require('moment');
const app = require('../../src/app');
const { getTrainsFromRenfe } = require('../../src/utils/scrapper.util');

jest.mock('../../src/utils/scrapper.util');

describe('Train routes', () => {
    describe('GET /trains', () => {
        let query;
        beforeEach(() => {
            query = {
                from: 'Madrid',
                to: 'Zaragoza',
                departDate: moment().add(1, 'd').format('DD-MM-YYYY'),
                returnDate: moment().add(2, 'd').format('DD-MM-YYYY')
            };
        });

        test('should return 200 and a data array if data is retrieved', async () => {
            const expectedArray = [
                {
                    trainId: 'tren03203',
                    departure: '20.30',
                    arrival: '21.54',
                    duration: '1 h. 24 min.',
                    trainType: 'AVE',
                    price: '55,70 €',
                    classType: 'Turista',
                    fare: 'Flexible'
                }
            ];
            getTrainsFromRenfe.mockResolvedValue(expectedArray);

            await request(app)
                .get('/trains')
                .query(query)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.length).toEqual(1);
                    expect(res.body).toEqual(expect.arrayContaining(expectedArray));
                });
        });

        test('should return 200 and an empty array if no data is retrieved', async () => {
            getTrainsFromRenfe.mockResolvedValue([]);

            await request(app)
                .get('/trains')
                .query(query)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).toEqual([]);
                });
        });

        test('should return 400 and error message if request data is missing', async () => {
            query = {};
            await request(app)
                .get('/trains')
                .query(query)
                .then((res) => {
                    expect(res.body).toEqual({
                        code: httpStatus.BAD_REQUEST,
                        message: '"from" is required'
                    });
                });
        });

        test('should return 400 and error message if departure date is in the past', async () => {
            query.departDate = moment().add(-2, 'd').format('DD-MM-YYYY');
            await request(app)
                .get('/trains')
                .query(query)
                .then((res) => {
                    expect(res.body).toEqual({
                        code: httpStatus.BAD_REQUEST,
                        message: '"departDate" must be greater than "now"'
                    });
                });
        });

        test('should return 400 and error message if return date is smaller than departure date', async () => {
            query.returnDate = moment().add(-2, 'd').format('DD-MM-YYYY');
            await request(app)
                .get('/trains')
                .query(query)
                .then((res) => {
                    expect(res.body).toEqual({
                        code: httpStatus.BAD_REQUEST,
                        message: '"returnDate" must be larger than or equal to "ref:departDate"'
                    });
                });
        });

        test('should return 500 if no data is retrieved', async () => {
            const errorMessage = 'Async error';
            getTrainsFromRenfe.mockRejectedValue(new Error(errorMessage));

            await request(app)
                .get('/trains')
                .query(query)
                .then((res) => {
                    const { body } = res;
                    expect(body).toHaveProperty('code', httpStatus.INTERNAL_SERVER_ERROR);
                    expect(body).toHaveProperty('message', errorMessage);
                    expect(body).toHaveProperty('stack');
                });
        });
    });
});
