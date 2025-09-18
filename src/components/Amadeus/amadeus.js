const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeHotels(city = "New York") {
  const browser = await puppeteer.launch({ headless: false }); // Debug mode
  const page = await browser.newPage();

  const url = `https://www.google.com/travel/search?q=hotels+in+${encodeURIComponent(city)}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for JS to load (old puppeteer use waitFor)
  await page.waitFor(5000);

  // Scroll to load more hotels
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  const hotels = await page.evaluate(() => {
    const hotelNodes = document.querySelectorAll('div[aria-label*="Hotel"]');
    const data = [];
    hotelNodes.forEach(h => {
      const name = h.querySelector('div[role="heading"]')?.innerText;
      const link = h.querySelector('a')?.href;
      const price = h.querySelector('div[data-testid*="price"]')?.innerText || "N/A";
      if (name && link) data.push({ name, link, price });
    });
    return data;
  });

  await browser.close();
  return hotels;
}

module.exports = { scrapeHotels };
