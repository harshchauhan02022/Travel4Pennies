const express = require('express');
const router = express.Router();

const scraperController = require('../controllers/hotel.controller')

router.get('/hotels', scraperController.getHotels);

module.exports = router;