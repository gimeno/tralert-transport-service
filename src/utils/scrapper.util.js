const moment = require('moment');
const puppeteer = require('puppeteer');
const $ = require('cheerio');

const TRAIN_WEBSITE = 'https://venta.renfe.com/vol/home.do?c=_0bNa';

const selectors = {
    inputDepartureStation: '#estacionOrigen_DescEstacion',
    inputArrivalStation: '#estacionDestino_DescEstacion',
    dropdownStationsSelector: '.ui-state-focus',
    inputDepartureDate: '#estacionOrigen_Fecha',
    comprarButton: '#form-compra-express > div.btns-block > button',
    departureTrainTable: '#listaTrenesTBodyIda'
};

const getTrainsFromRenfe = async ({ from, to, departDate }) => {
    // Prepare puppeteer
    const browser = await puppeteer.launch();
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto(TRAIN_WEBSITE);

    // Enter origin and destination
    await page.type(selectors.inputDepartureStation, from, { delay: 400 });
    await page.click(selectors.dropdownStationsSelector);
    await page.type(selectors.inputArrivalStation, to, { delay: 400 });
    await page.click(selectors.dropdownStationsSelector);

    // Departure date
    await page.click(selectors.inputDepartureDate);
    await page.keyboard.down('Shift');
    await page.keyboard.press('Home');
    await page.keyboard.press('Backspace');
    await page.type(selectors.inputDepartureDate, moment(departDate).format('DD-MM-YYYY'), { delay: 100 });

    // Click on comprar
    const newPagePromise = new Promise((x) => browser.on('targetcreated', (target) => x(target.page())));
    await page.click(selectors.comprarButton);

    // Filter search data
    const newPage = await newPagePromise;
    await newPage.waitForNavigation();
    const html = await newPage.content();

    const trainsDeparture = $(selectors.departureTrainTable, html)
        .children()
        .toArray()
        .filter((train) => !train.attribs.id.includes('trayectoDetalle'));

    // Map train data
    function mapTrainData(train) {
        const trainId = train.attribs.id;
        const departure = $(`#${trainId} > td:nth-child(2) > span`, html).text();
        const arrival = $(`#${trainId} > td:nth-child(3) > span`, html).text();
        const duration = $(`#${trainId} > td:nth-child(4) > span`, html).text();
        const trainType = $(`#${trainId} > td:nth-child(5) > span`, html).text();
        const price = $(`#${trainId} > td:nth-child(6) > button`, html).text();
        const classType = $(`#${trainId} > td:nth-child(7) > span`, html).text();
        const fare = $(`#${trainId} > td:nth-child(8) > span`, html).text();

        return {
            trainId,
            departure,
            arrival,
            duration,
            trainType,
            price,
            classType,
            fare
        };
    }
    const dataDepartureDate = trainsDeparture.map(mapTrainData);

    await browser.close();

    return dataDepartureDate;
};

module.exports = {
    getTrainsFromRenfe
};
