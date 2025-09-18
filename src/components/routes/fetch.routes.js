const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetch.Controller');

router.get('/fetch', fetchController.fetchNow);

module.exports = router;
