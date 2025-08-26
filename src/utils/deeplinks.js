// utils/deeplinks.js

const enc = v => encodeURIComponent(v || '');

function googleHotelLink({ city, checkIn, checkOut, adults }) {
    return `https://www.google.com/travel/hotels?q=hotels+in+${enc(city)}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`;
}

module.exports = { googleHotelLink };
