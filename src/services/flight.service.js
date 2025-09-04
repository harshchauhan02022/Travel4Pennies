const amadeus = require('../utils/amadeusClient');

async function searchFlights(origin, destination, departureDate, returnDate, adults = 1) {
  const params = {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults,
    currencyCode: 'USD',
    max: 10
  };

  if (returnDate) params.returnDate = returnDate;

  const response = await amadeus.shopping.flightOffersSearch.get(params);

  return response.data.map(flight => {
    return {
      id: flight.id,
      price: flight.price.total,
      currency: flight.price.currency,
      itineraries: flight.itineraries,
      bookingLink: `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}+on+${departureDate}`
    };
  });
}

module.exports = { searchFlights };
