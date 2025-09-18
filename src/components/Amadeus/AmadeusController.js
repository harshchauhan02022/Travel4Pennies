const { scrapeHotels } = require('./amadeus');

const searchHotels = async (req, res) => {
    try {
        const city = req.query.city || "New York";

        const hotels = await scrapeHotels(city);
        res.json({ success: true, city, hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error scraping hotels", error: error.message });
    }
};

module.exports = { searchHotels };