const express = require("express");
const router = express.Router();
const CarController = require("../controllers/car.controller");

router.get("/cars", CarController.getCars);

// router.get("/cars/expedia", CarController.getExpediaCars);

module.exports = router;
