const express = require('express');
const validate = require('../middlewares/validate');
const { trainValidation } = require('../validations');
const { trainController } = require('../controllers');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Train:
 *     properties:
 *       trainId:
 *         type: string
 *       departure:
 *         type: string
 *       arrival:
 *         type: string
 *       duration:
 *         type: string
 *       trainType:
 *         type: string
 *       price:
 *         type: string
 *       classType:
 *         type: string
 *       fare:
 *         type: string
 */

/**
 * @swagger
 * /trains:
 *   get:
 *     tags:
 *       - Trains
 *     description: Returns all trains for the departure date
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: 'from'
 *         in: 'query'
 *         description: 'City of origin'
 *         required: true
 *         type: 'string'
 *       - name: 'to'
 *         in: 'query'
 *         description: 'City of destination'
 *         required: true
 *         type: 'string'
 *       - name: 'departDate'
 *         in: 'query'
 *         description: 'Date of departure'
 *         required: true
 *         type: 'string'
 *       - name: 'returnDate'
 *         in: 'query'
 *         description: 'Date of arrival'
 *         type: 'string'
 *     responses:
 *       200:
 *         description: An array of available trains for the departure date
 *         schema:
 *           type: 'array'
 *           items:
 *              $ref: '#/definitions/Train'
 *       400:
 *         description: "Invalid data query"
 */
router.get('/', validate(trainValidation.getTrains), trainController.getTrains);

module.exports = router;
