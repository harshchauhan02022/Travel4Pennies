const express = require("express");
const router = express.Router();
const { getFlights } = require("../controllers/flight.controller");

// GET /api/flights?from=DEL&to=JFK&departDate=2025-09-20&returnDate=2025-09-28
router.get("/flights", getFlights);

module.exports = router;
