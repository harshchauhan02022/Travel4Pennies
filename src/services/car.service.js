const axios = require("axios");
const { getAccessToken } = require("../utils/amadeus");
const { affiliateCarLink } = require("../utils/car.deeplinks");
require("dotenv").config();

const AMADEUS_BASE = process.env.AMADEUS_BASE;

async function searchCars(cityCode, pickupDate, dropoffDate, drivers = 1) {
  const token = await getAccessToken();

  const resp = await axios.get(`${AMADEUS_BASE}/v1/shopping/vehicle-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      pickUpLocationCode: cityCode,   // e.g. LAX
      pickUpDate: pickupDate,         // 2025-09-10T10:00:00
      returnDate: dropoffDate,        // 2025-09-15T10:00:00
      driverAge: 30,                  // required by Amadeus
      currency: "USD"
    },
  });

  const offers = resp.data.data || [];
  if (!offers.length) throw new Error("No car rental offers found");

  return offers.map((offer) => {
    const vehicle = offer.vehicle || {};
    const provider = vehicle.provider?.name || "Unknown";
    const model = vehicle.model || "Car";

    return {
      id: offer.id,
      provider,
      model,
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
