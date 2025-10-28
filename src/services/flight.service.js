const amadeus = require('../utils/amadeusClient');

/**
 * Search Flights (One-way or Return)
 * Works in both Sandbox & Production
 */
async function searchFlights(origin, destination, departureDate, returnDate, adults = 1, limit = 10) {
  const params = {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults: Number(adults) || 1,
    currencyCode: 'USD',
    max: Number(limit) || 10,
  };

  if (returnDate) params.returnDate = returnDate;

  const response = await amadeus.shopping.flightOffersSearch.get(params);
  const data = response.data || [];

  // 🧩 Format results
  const flights = data.map((flight) => {
    const firstItinerary = flight.itineraries?.[0];
    const firstSegment = firstItinerary?.segments?.[0];
    const lastSegment = firstItinerary?.segments?.slice(-1)[0];

    const departure = firstSegment?.departure?.iataCode || origin;
    const arrival = lastSegment?.arrival?.iataCode || destination;

    return {
      id: flight.id,
      airline: firstSegment?.carrierCode || "N/A",
      flightNumber: firstSegment?.number || "N/A",
      origin: departure,
      destination: arrival,
      departureDateTime: firstSegment?.departure?.at,
      arrivalDateTime: lastSegment?.arrival?.at,
      duration: firstItinerary?.duration || "N/A",
      stops: firstItinerary?.segments?.length - 1 || 0,
      price: `${flight.price.total} ${flight.price.currency}`,
      bookingLink: `https://www.google.com/travel/flights?q=flights+from+${departure}+to+${arrival}+on+${departureDate}`,
    };
  });

  // ⚠️ Fallback dummy data for sandbox (if nothing found)
  if (!flights.length) {
    console.warn("⚠️ No flights found in sandbox, returning fallback data.");

    return [
      {
        id: "DEMO-FLT-001",
        airline: "Demo Air",
        flightNumber: "DA101",
        origin,
        destination,
        departureDateTime: `${departureDate}T09:00:00`,
        arrivalDateTime: `${departureDate}T11:30:00`,
        duration: "PT2H30M",
        stops: 0,
        price: "199.00 USD",
        bookingLink: `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}+on+${departureDate}`,
      },
    ];
  }

  return flights;
}

module.exports = { searchFlights };
