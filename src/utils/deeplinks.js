// Helper to encode values safely
const enc = (v) => encodeURIComponent(v || '');

/**
 * Generate Google Hotels search link
 * Currently searches by city
 */
function googleHotelLink({ city, checkIn, checkOut, adults }) {
  return `https://www.google.com/travel/hotels?q=hotels+in+${enc(city)}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`;
}

module.exports = { googleHotelLink };
