const { scrapeHotels } = require("../../services/hotel.service");

exports.getHotels = async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      page = 1,
      limit = 10
    } = req.query;

    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide city, checkIn, and checkOut dates"
      });
    }

    const hotels = await scrapeHotels(city, checkIn, checkOut, Number(page), Number(limit));

    res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      count: hotels.length,
      data: hotels
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
