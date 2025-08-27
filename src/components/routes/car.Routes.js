const express = require('express');
const router = express.Router();
const { searchCars } = require('../controllers/car.controller');

router.get('/search', searchCars);

module.exports = router;
