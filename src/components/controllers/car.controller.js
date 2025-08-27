// controllers/cars.controller.js
const amadeus = require('../../utils/amadeusClient');

const enc = v => encodeURIComponent(v || '');

exports.searchCars = async (req, res) => {
    try {
        const {
            provider = "rentalcars",
            city = "",
            pickup = "",
            dropoff = "",
            drivers = 1
        } = req.query;

        // Check required fields properly
        if (!city.trim() || !pickup.trim() || !dropoff.trim()) {
            return res.status(400).json({
                success: false,
                error: "Please provide city, pickup, and dropoff dates"
            });
        }

        // Build affiliate link
        const link = `https://www.${provider}.com/cars?city=${enc(city)}&pickup=${enc(pickup)}&dropoff=${enc(dropoff)}&drivers=${drivers}`;

        return res.json({
            success: true,
            provider,
            link
        });
    } catch (err) {
        console.error("Car rental search error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
