// utils/car.deeplinks.js

const enc = v => encodeURIComponent(v || '');

function affiliateCarLink({ provider, city, pickup, dropoff, drivers }) {
    // Example deep link (replace with your real affiliate link template if you have one)
    return `https://www.${provider.toLowerCase()}.com/cars?city=${enc(city)}&pickup=${pickup}&dropoff=${dropoff}&drivers=${drivers}`;
}

module.exports = { affiliateCarLink };
