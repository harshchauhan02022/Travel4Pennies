const { scrapeFlights } = require("../../services/flight.service");

exports.getFlights = async (req, res) => {
  try {
    const { from, to, departDate, returnDate } = req.query;

    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide from, to, and departDate (returnDate optional)"
      });
    }

    const flights = await scrapeFlights(from, to, departDate, returnDate);

    if (!flights || flights.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No flights found"
      });
    }

    res.json({ success: true, data: flights });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
