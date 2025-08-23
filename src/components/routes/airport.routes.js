const express = require("express");
const router = express.Router();
const { searchAirports } = require("../controllers/airport.controller");

router.get("/search", searchAirports);

module.exports = router;
