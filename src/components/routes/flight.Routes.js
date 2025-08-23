const express = require('express');
const router = express.Router();
const flightCtrl = require('../controllers/flight.controller');

router.get('/search', flightCtrl.search);

module.exports = router;
