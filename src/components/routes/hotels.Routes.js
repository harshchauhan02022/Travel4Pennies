const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

router.get("/search", hotelController.searchHotels);

module.exports = router;
