const { scrapeRugged } = require("../../services/car.service");

exports.searchCars = async (req, res) => {
  try {
    const {
      pickup = "Salt Lake City",
      dropoff = "Salt Lake City",
      startDate = "2025-09-20",
      endDate = "2025-09-25"
    } = req.query;

    const vehicles = await scrapeRugged(pickup, dropoff, startDate, endDate);

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vehicles",
      details: error.message
    });
  }
};
