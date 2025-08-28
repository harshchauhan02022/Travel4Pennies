const { searchHotels } = require('../../services/hotel.service');
const { getHotelCurrentPrice } = require('../../services/hotel.service');
const UserPriceTracking = require('../models/userPriceTracking');
const { sendPriceDropEmail } = require('../../utils/mailer');

exports.search = async (req, res) => {
    try {
        const {
            cityCode,
            checkInDate,
            checkOutDate,
            adults = 1,
            limit = 10,  // default 10 per page
            page = 1     // default page 1
        } = req.query;

        if (!cityCode || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                error: 'cityCode, checkInDate, checkOutDate required'
            });
        }

        // Fetch all hotels first
        const allHotels = await searchHotels(
            cityCode,
            checkInDate,
            checkOutDate,
            Number(adults),
            200 // fetch a higher limit initially
        );

        // Apply pagination
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedData = allHotels.slice(startIndex, endIndex);

        return res.json({
            success: true,
            total: allHotels.length,
            page: Number(page),
            perPage: Number(limit),
            data: paginatedData
        });
    } catch (err) {
        console.error('Hotel search error:', err?.response?.data || err.message || err);
        return res.status(500).json({
            success: false,
            error: err?.message || 'Failed to fetch hotels'
        });
    }
};


exports.trackHotel = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { hotelId, hotelName, checkInDate, checkOutDate, adults = 1, currentPrice, currency = 'USD' } = req.body;

        if (!hotelId || !currentPrice) {
            return res.status(400).json({ success: false, error: 'hotelId and currentPrice are required' });
        }

        const [record, created] = await UserPriceTracking.findOrCreate({
            where: {
                user_id: userId,
                hotel_id: hotelId,
                check_in: checkInDate || null,
                check_out: checkOutDate || null
            },
            defaults: {
                hotel_name: hotelName || null,
                last_price: parseFloat(currentPrice),
                adults,
                currency,
                active: true
            }
        });

        if (!created) {
            record.hotel_name = hotelName || record.hotel_name;
            record.last_price = parseFloat(currentPrice);
            record.active = true;
            record.adults = adults;
            record.currency = currency;
            await record.save();
        }

        return res.json({ success: true, message: 'Tracking created/updated', data: record });
    } catch (err) {
        console.error('trackHotel error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Failed to track hotel' });
    }
};

exports.listUserTracks = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const tracks = await UserPriceTracking.findAll({ where: { user_id: userId } });
        return res.json({ success: true, count: tracks.length, data: tracks });
    } catch (err) {
        console.error('listUserTracks error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Failed to fetch tracks' });
    }
};

exports.deleteTrack = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { id } = req.params;
        const record = await UserPriceTracking.findOne({ where: { id, user_id: userId } });
        if (!record) return res.status(404).json({ success: false, message: 'Track not found' });

        await record.destroy();
        return res.json({ success: true, message: 'Track removed' });
    } catch (err) {
        console.error('deleteTrack error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Failed to delete track' });
    }
};
