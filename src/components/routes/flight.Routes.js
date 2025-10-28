const express = require('express');
const router = express.Router();
const { getFlights } = require('../controllers/flightController');

router.get('/flights', getFlights);

module.exports = router;
