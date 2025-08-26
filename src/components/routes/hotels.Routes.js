const express = require('express');
const { search } = require('../controllers/hotel.controller');
const router = express.Router();

router.get('/search', search);

module.exports = router;
