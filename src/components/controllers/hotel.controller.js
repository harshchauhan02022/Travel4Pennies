const { searchHotels } = require('../../services/hotel.service');

exports.search = async (req, res) => {
    try {
        const {
            cityCode,
            checkInDate,
            checkOutDate,
            adults = 1,
            limit = 50,
        } = req.query;

        if (!cityCode || !checkInDate || !checkOutDate) {
            return res
                .status(400)
                .json({ success: false, error: 'cityCode, checkInDate, checkOutDate are required' });
        }

        const data = await searchHotels(cityCode, checkInDate, checkOutDate, Number(adults), Number(limit));

        return res.json({
            success: true,
            count: data.length,
            data,
        });
    } catch (err) {
        console.error('Hotel search error:', err?.response?.data || err.message || err);
        return res
            .status(500)
            .json({ success: false, error: err?.message || 'Failed to fetch hotels' });
    }
};
