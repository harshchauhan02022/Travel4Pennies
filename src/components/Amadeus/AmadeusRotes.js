const express = require("express");
const router = express.Router();
const { searchHotels } = require("./AmadeusController");

router.get("/hotels", searchHotels);

module.exports = router;
