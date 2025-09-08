const { scrapeCars } = require('../../services/car.service');
// const { scrapeExpediaCars } = require("../../services/expedia.service");

exports.getCars = async (req, res) => {
  try {
    const { city, pickup, dropoff, page = 1, limit = 10 } = req.query;

    if (!city || !pickup || !dropoff) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    const result = await scrapeCars(city, pickup, dropoff, parseInt(page), parseInt(limit));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scraping failed', details: err.message });
  }
};

// exports.getExpediaCars = async (req, res) => {
//   try {
//     const { city, pickupDate, dropoffDate, pickupTime, dropoffTime } = req.query;

//     if (!city || !pickupDate || !dropoffDate) {
//       return res.status(400).json({ success: false, error: "Missing parameters" });
//     }

//     const result = await scrapeExpediaCars(city, pickupDate, dropoffDate, pickupTime, dropoffTime);
//     res.json(result);

//   } catch (err) {
//     console.error("❌ Controller Error:", err.message);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };