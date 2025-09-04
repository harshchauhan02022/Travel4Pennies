const amadeus = require('../utils/amadeusClient');
const { googleHotelLink } = require('../utils/deeplinks');

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ]);
}

async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 1, limit = 50) {
    try {
        const listResp = await withTimeout(
            amadeus.referenceData.locations.hotels.byCity.get({
                cityCode,
                hotelSource: 'ALL'
            }),
            5000 
        );

        const hotelIds = (listResp.data || []).slice(0, 100).map(h => h.hotelId);
        if (!hotelIds.length) throw new Error('No hotels found');

        const chunkSize = 20;
        const chunks = [];
        for (let i = 0; i < hotelIds.length; i += chunkSize) {
            chunks.push(hotelIds.slice(i, i + chunkSize));
        }

        const fetchChunk = ids =>
            withTimeout(
                amadeus.shopping.hotelOffersSearch.get({
                    hotelIds: ids.join(','),
                    checkInDate,
                    checkOutDate,
                    adults: Number(adults) || 1,
                    sort: 'PRICE',
                    currency: 'USD',
                }),
                10000 
            );

        const results = await Promise.allSettled(chunks.map(fetchChunk));

        const allOffers = [];
        for (const r of results) {
            if (r.status === 'fulfilled') {
                (r.value.data || []).forEach(h => {
                    if (h.offers?.length) {
                        const hotel = h.hotel || {};
                        const first = h.offers[0];
                        allOffers.push({
                            hotelId: hotel.hotelId || h.id,
                            name: hotel.name || 'Unknown',
                            address: hotel.address?.lines?.join(', ') || hotel.address?.cityName || cityCode,
                            rating: hotel.rating || null,
                            price: first.price?.total || null,
                            currency: first.price?.currency || 'USD',
                            checkInDate: first.checkInDate || checkInDate,
                            checkOutDate: first.checkOutDate || checkOutDate,
                            bookingLink: googleHotelLink({
                                city: hotel.address?.cityName || cityCode,
                                checkIn: checkInDate,
                                checkOut: checkOutDate,
                                adults,
                            }),

                        });
                    }
                });
            }
        }

        if (!allOffers.length) throw new Error('No hotel offers found');

        return allOffers
            .filter(x => x.price)
            .sort((a, b) => Number(a.price) - Number(b.price))
            .slice(0, limit);

    } catch (err) {
        console.error('searchHotels error:', err.message);
        throw new Error('Failed to fetch hotels');
    }
}
           
async function getHotelCurrentPrice(hotelId, checkInDate, checkOutDate, adults = 1, currency = 'USD') {
    try {
        const resp = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelId,
            checkInDate,
            checkOutDate,
            adults: Number(adults) || 1,
            sort: 'PRICE',
            currency
        });

        const data = resp.data || [];
        if (!data.length) return null;

        const h = data[0]; 
        if (Array.isArray(h.offers) && h.offers.length) {
            const first = h.offers[0];
            return {
                hotelId: h.hotel?.hotelId || h.id || hotelId,
                hotelName: h.hotel?.name || null,
                price: parseFloat(first.price?.total || first.price || null),
                currency: first.price?.currency || currency,
                offer: first
            };
        }
        return null;
    } catch (err) {
        console.error('getHotelCurrentPrice error:', err?.response?.data || err.message || err);
        return null;
    }
}

module.exports = { searchHotels, getHotelCurrentPrice };
