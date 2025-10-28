const express = require('express');
const router = express.Router();
const carCtrl = require('../controllers/car.controller');

router.get('/search', carCtrl.search);

module.exports = router;
