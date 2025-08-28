const enc = (v) => encodeURIComponent(v || "");

function affiliateCarLink({ provider, city, pickup, dropoff, drivers }) {
  return `https://www.${provider.toLowerCase()}.com/cars?city=${enc(city)}&pickup=${pickup}&dropoff=${dropoff}&drivers=${drivers}`;
}

module.exports = { affiliateCarLink };
