const axios = require("axios");
const { getAccessToken, BASE } = require("../../config/amadeus");
const { expediaHotelDeeplink } = require("../../utils/deeplinks");

exports.searchHotels = async (req, res) => {
    try {
        const {
            cityCode,
            checkInDate,
            checkOutDate,
            adults = 1,
            currencyCode = "USD",
            roomQuantity = 1,
            bestRateOnly = true,
            radius = 20, // km
            max = 10
        } = req.query;

        if (!cityCode || !checkInDate || !checkOutDate) {
            return res.status(400).json({ error: "cityCode, checkInDate, checkOutDate are required" });
        }

        const token = await getAccessToken();

        // ✅ Correct endpoint & params
        const amadeusRes = await axios.get(`${BASE}/v3/shopping/hotel-offers`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                cityCode,
                checkInDate,
                checkOutDate,
                adults: Number(adults),
                roomQuantity,
                currencyCode,
                bestRateOnly,
                radius,
                radiusUnit: "KM",
                hotelSource: "ALL",
                view: "FULL",
                sort: "PRICE", // sort by price
                limit: max
            }
        });

        const offers = amadeusRes.data?.data || [];

        // Add booking links
        const withLinks = offers.map((hotel) => {
            const hotelId = hotel.hotel?.hotelId || hotel.id;
            const city = hotel.hotel?.address?.cityName || cityCode;

            const bookingLink = expediaHotelDeeplink({
                hotelId,
                city,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                adults
            });

            return {
                ...hotel,
                bookingLink
            };
        });

        res.json({
            meta: amadeusRes.data?.meta || {},
            data: withLinks,
            warning: offers.length === 0 ? "No hotel offers found (sandbox might return empty data)" : undefined
        });

    } catch (err) {
        console.error("Amadeus Error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            error: err.response?.data || { message: err.message }
        });
    }
};
