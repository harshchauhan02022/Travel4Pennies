// services/searchHotels.js

const amadeus = require('../utils/amadeusClient');
const { googleHotelLink } = require('../utils/deeplinks');

/**
 * Amadeus Hotel Search (SDK) with batching:
 * 1) Get many hotelIds for a city
 * 2) Call /v3/shopping/hotel-offers in chunks of up to 20 hotelIds
 * 3) Merge + map + sort results
 */
async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 1, limit = 50) {
    // 1) List hotels by city (ids)
    const listResp = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode,
        hotelSource: 'ALL',
    });

    const hotelIds = (listResp.data || []).map((h) => h.hotelId);

    if (!hotelIds.length) {
        throw new Error('No hotels found for this city (Amadeus returned empty list)');
    }

    // 2) Batch hotelIds (Amadeus typically allows up to ~20 ids per call)
    const chunkSize = 20;
    const chunks = [];
    for (let i = 0; i < hotelIds.length; i += chunkSize) {
        chunks.push(hotelIds.slice(i, i + chunkSize));
    }

    const allOffers = [];

    for (const ids of chunks) {
        const resp = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: ids.join(','),
            checkInDate,
            checkOutDate,
            adults: Number(adults) || 1,
            sort: 'PRICE',
            currency: 'USD',
        });

        const data = resp.data || [];
        for (const h of data) {
            const hotel = h.hotel || {};
            const name = hotel.name || 'Unknown';
            const cityName = hotel.address?.cityName || cityCode;

            // Take the first available offer (cheapest first due to sort=PRICE)
            if (Array.isArray(h.offers) && h.offers.length) {
                const first = h.offers[0];

                allOffers.push({
                    hotelId: hotel.hotelId || h.id,
                    name,
                    address: hotel.address?.lines?.join(', ') || cityName,
                    rating: hotel.rating || null,
                    price: first?.price?.total || null,
                    currency: first?.price?.currency || 'USD',
                    checkInDate: first?.checkInDate || checkInDate,
                    checkOutDate: first?.checkOutDate || checkOutDate,
                    bookingLink: googleHotelLink({
                        city: cityName,
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        adults,
                    }),
                });
            }
        }

        // Stop early when enough items collected
        if (allOffers.length >= limit) break;
    }

    if (!allOffers.length) {
        throw new Error('No hotel offers found (try production creds / different dates)');
    }

    // Sort by price (asc) & limit
    const sorted = allOffers
        .filter((x) => x.price)
        .sort((a, b) => Number(a.price) - Number(b.price))
        .slice(0, limit);

    return sorted;
}

module.exports = { searchHotels };
