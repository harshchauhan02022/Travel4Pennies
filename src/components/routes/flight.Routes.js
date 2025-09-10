const express = require("express");
const router = express.Router();
const { getFlights } = require("../controllers/flight.controller");

// Example: /api/flights?from=DEL&to=JFK&departDate=250920&returnDate=250928
router.get("/flights", getFlights);

module.exports = router;
