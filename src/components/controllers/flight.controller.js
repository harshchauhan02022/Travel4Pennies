const { searchFlights } = require('../../services/flight.service');

exports.search = async (req, res) => {
    try {
        const { origin, destination, departureDate, returnDate, adults } = req.query;

        if (!origin || !destination || !departureDate) {
            return res.status(400).json({ success: false, message: "origin, destination, departureDate required" });
        }

        const data = await searchFlights(origin, destination, departureDate, returnDate, adults || 1);
        res.json({ success: true, ...data });

    } catch (err) {
        console.error("Flight Search Error:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.message, details: err.response?.data });
    }
};
