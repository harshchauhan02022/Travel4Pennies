const { searchCars } = require('../../services/car.service');

exports.search = async (req, res) => {
    try {
        const { pickupLocation, pickupDateTime, returnDateTime, currency } = req.query;

        if (!pickupLocation || !pickupDateTime || !returnDateTime) {
            return res.status(400).json({
                success: false,
                message: "pickupLocation, pickupDateTime, returnDateTime required"
            });
        }

        const cars = await searchCars(pickupLocation, pickupDateTime, returnDateTime, currency || 'USD');

        res.json({
            success: true,
            count: cars.length,
            data: cars
        });

    } catch (err) {
        console.error("Car Rental Search Error:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};
