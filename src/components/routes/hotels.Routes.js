// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

// public search is ok, but for alert check we require token when tracking or listing
router.get('/search', hotelController.search);

router.post('/track', verifyToken, hotelController.trackHotel);         // set alert (from button)
router.get('/tracks', verifyToken, hotelController.listUserTracks);    // list user's tracked
router.delete('/track/:id', verifyToken, hotelController.deleteTrack); // remove track

module.exports = router;
