const express = require('express');
const trainRoute = require('./train.route');

const router = express.Router();

router.use('/trains', trainRoute);

module.exports = router;
