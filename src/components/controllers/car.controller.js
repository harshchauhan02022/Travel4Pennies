const { searchCars } = require("../../services/car.service");

exports.searchCars = async (req, res) => {
  try {
    const { cityCode, pickupDate, dropoffDate } = req.query;

    if (!cityCode || !pickupDate || !dropoffDate) {
      return res.status(400).json({
        success: false,
        error: "Please provide cityCode, pickupDate, and dropoffDate",
      });
    }

    const cars = await searchCars(cityCode, pickupDate, dropoffDate);
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
