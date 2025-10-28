const amadeus = require('../utils/amadeusClient');

const hotelRatings = {
  CPDELD95: 4.0,
  CPDELE6B: 4.3,
  SIDEL996: 4.0,
  HIDEL429: 4.0,
  MCDELAPM: 4.0,
};

async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 1, limit = 50) {
  // 1️⃣ Fetch hotel list
  const listResp = await amadeus.referenceData.locations.hotels.byCity.get({
    cityCode,
    hotelSource: 'ALL',
  });

  if (!listResp || !listResp.data || !listResp.data.length)
    throw new Error('No hotels found for this city.');

  const hotelIds = listResp.data.map((h) => h.hotelId);
  const chunkSize = 20;
  const allOffers = [];

  for (let i = 0; i < hotelIds.length && allOffers.length < limit; i += chunkSize) {
    const ids = hotelIds.slice(i, i + chunkSize);

    const resp = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: ids.join(','),
      checkInDate,
      checkOutDate,
      adults: Number(adults) || 1,
      sort: 'PRICE',
      currency: 'USD',
    });

    const hotels = resp.data || [];

    for (const h of hotels) {
      const hotel = h.hotel || {};
      const cityName = hotel.address?.cityName || cityCode;

      if (Array.isArray(h.offers) && h.offers.length) {
        const first = h.offers[0];
        const deeplinkUrl = first?.links?.deeplink || first?.links?.self || null;
        const priceValue = parseFloat(first?.price?.total || 0);

        allOffers.push({
          hotelId: hotel.hotelId || 'UNKNOWN',
          name: hotel.name || 'Unknown Hotel',
          address: hotel.address?.lines?.join(', ') || cityName,
          rating: hotelRatings[hotel.hotelId] || hotel.rating || null,
          price: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: first?.price?.currency || 'USD',
          }).format(priceValue),
          currency: first?.price?.currency || 'USD',
          checkInDate: first?.checkInDate || checkInDate,
          checkOutDate: first?.checkOutDate || checkOutDate,
          bookingLink:
            deeplinkUrl ||
            `https://hotel-link.amadeus.com/${hotel.hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
        });
      }
    }
  }

  // 4️⃣ Fallback demo data
  if (!allOffers.length) {
    console.warn('⚠️ No offers found in sandbox, using fallback demo data.');
    return [
      {
        hotelId: 'DEMO123',
        name: 'Holiday Inn Example Hotel',
        address: 'Demo City Center',
        rating: 4.2,
        price: '$199.00',
        currency: 'USD',
        checkInDate,
        checkOutDate,
        bookingLink: `https://hotel-link.amadeus.com/DEMO123?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
      },
    ];
  }

  // 5️⃣ Sort by price & limit
  const sorted = allOffers
    .filter((x) => x.price)
    .sort((a, b) => {
      const numA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
      return numA - numB;
    })
    .slice(0, limit);

  return sorted;
}

module.exports = { searchHotels };
