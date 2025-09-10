const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function scrapeFlights(from, to, departDate, returnDate) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  const url = `https://www.skyscanner.com/transport/flights/${from}/${to}/${departDate}/${returnDate}/?adultsv2=1&currency=USD`;
  console.log("🔎 Navigating to:", url);

  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  // Wait for flight cards – fallback to multiple possible selectors
  const flightCardSelector = '[data-testid="flight_card_outer"], [data-testid="flight_card_segment"], .ItineraryItem';
  await page.waitForSelector(flightCardSelector, { timeout: 30000 });

  // Scroll to load more flights
  await autoScroll(page);

  // Extract data
  const flights = await page.evaluate(() => {
    const results = [];
    const cards = document.querySelectorAll(
      '[data-testid="flight_card_outer"], [data-testid="flight_card_segment"], .ItineraryItem'
    );
    cards.forEach((card) => {
      const airline =
        card.querySelector('[data-testid="airline-name"]')?.innerText ||
        card.querySelector(".LegInfo_airlineName")?.innerText ||
        "";
      const depart =
        card.querySelector('[data-testid="departure-time"]')?.innerText ||
        card.querySelector(".LegInfo_departureTime")?.innerText ||
        "";
      const arrive =
        card.querySelector('[data-testid="arrival-time"]')?.innerText ||
        card.querySelector(".LegInfo_arrivalTime")?.innerText ||
        "";
      const price =
        card.querySelector('[data-testid="price-text"]')?.innerText ||
        card.querySelector(".Price_mainPriceContainer")?.innerText ||
        "";
      const link =
        card.querySelector('a[aria-label*="Select"]')?.href || "";

      if (airline || price) results.push({ airline, depart, arrive, price, bookingLink: link });
    });
    return results;
  });

  await browser.close();
  return flights;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
}

module.exports = { scrapeFlights };
