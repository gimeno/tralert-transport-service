const catchAsync = require('../utils/catchAsync');
const { trainService } = require('../services');

const getTrains = catchAsync(async (req, res) => {
    const trains = await trainService.getTrains(req.query);
    res.send(trains);
});

module.exports = {
    getTrains
};
