const { scrapeFlights } = require("../../services/flight.service");

exports.getFlights = async (req, res) => {
  try {
    const { from, to, departDate, returnDate } = req.query;

    if (!from || !to || !departDate) {
      return res.status(400).json({ success: false, message: "Missing required params" });
    }

    const data = await scrapeFlights(from, to, departDate, returnDate);

    res.json({
      success: true,
      count: data.length,
      flights: data,
    });
  } catch (error) {
    console.error("Error scraping flights:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
