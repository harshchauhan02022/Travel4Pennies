const { scrapeFlights } = require("../../services/flight.service");

exports.getFlights = async (req, res) => {
  try {
    const { from, to, departDate, returnDate } = req.query;

    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: from, to, departDate",
      });
    }

    const flights = await scrapeFlights(from, to, departDate, returnDate);

    res.json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Scraping failed",
      details: err.message,
    });
  }
};
