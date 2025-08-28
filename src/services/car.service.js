const axios = require("axios");
const { getAccessToken, AMADEUS_BASE } = require("../utils/amadeus");
const { affiliateCarLink } = require("../utils/car.deeplinks");

async function searchCars(cityCode, pickupDate, dropoffDate, drivers = 1) {
  const token = await getAccessToken();

  const resp = await axios.get(`${AMADEUS_BASE}/v1/shopping/vehicle-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {

      locationCode: cityCode,       // Example: "NYC"
      pickUpDateTime: pickupDate,   // Example: "2025-09-01T10:00:00"
      returnDateTime: dropoffDate,  // Example: "2025-09-05T10:00:00"
      driverAge: 30                 // Amadeus requires driver age
    }
  }); 

  const offers = resp.data.data || [];
  if (!offers.length) return [];

  return offers.map((offer) => {
    const vehicle = offer.vehicle || {};
    const provider = offer.provider?.name || "Unknown";

    return {
      carId: offer.id,
      provider,
      model: vehicle.model || "Car",
      category: vehicle.vehicleType || null,
      price: offer.price?.total || null,
      currency: offer.price?.currency || "USD",
      pickupDate,
      dropoffDate,
      bookingLink: affiliateCarLink({
        provider,
        city: cityCode,
        pickup: pickupDate,
        dropoff: dropoffDate,
        drivers
      })
    };
  });
}

module.exports = { searchCars };
