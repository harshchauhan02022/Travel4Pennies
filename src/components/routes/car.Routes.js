const express = require("express");
const router = express.Router();
const { saveCars, getCars, searchCars } = require("../controllers/car.controller");

router.post("/cars/save", saveCars);
router.get("/cars/search", searchCars);   // 🆕

router.get("/cars", getCars);   

module.exports = router;
