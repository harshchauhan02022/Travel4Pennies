const { searchFlights } = require('../../services/flight.service');

exports.search = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults = 1, limit = 10 } = req.query;

    // ✅ Validate required fields
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        success: false,
        error: "origin, destination, and departureDate are required.",
      });
    }

    const flights = await searchFlights(origin, destination, departureDate, returnDate, Number(adults), Number(limit));

    return res.json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (err) {
    console.error("Flight Search Error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Failed to fetch flights.",
      details: err?.response?.data || null,
    });
  }
};
