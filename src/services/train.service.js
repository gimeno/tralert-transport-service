const { getTrainsFromRenfe } = require('../utils/scrapper.util');

const getTrains = async (query) => {
    const trains = await getTrainsFromRenfe(query);
    const filteredTrains = trains.filter((train) => train.price !== '');
    return filteredTrains;
};

module.exports = {
    getTrains
};
