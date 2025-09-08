const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
const fs = require("fs");

async function scrapeCars(city, pickup, dropoff) {
  // Ensure dates are in YYYY-MM-DD format
  const pickupDate = new Date(pickup).toISOString().split("T")[0];
  const dropoffDate = new Date(dropoff).toISOString().split("T")[0];

  // Construct Booking.com car rentals URL
  const url = `https://www.booking.com/cars/searchresults.html?pickup=${city}&dropoff=${city}&pickup_date=${pickupDate}&dropoff_date=${dropoffDate}`;

  const browser = await puppeteer.launch({
    headless: true, // change to false to debug in browser
    args: ["--no-sandbox", "--disable-setuid-sandbox"], 
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
    );

    console.log(`🔎 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Save HTML for debugging (to check actual  selectors Booking uses)
    const content = await page.content();
    fs.writeFileSync("booking.html", content);

    // Wait until at least 1 car result shows up
    await page.waitForFunction(
      () => document.querySelectorAll('[data-testid*="car"]').length > 0,
      { timeout: 60000 }
    );

    // Extract data from car result cards
    const cars = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('[data-testid*="car"]').forEach((el) => {
        results.push({
          supplier:
            el.querySelector('[data-testid*="supplier"]')?.innerText || null,
          name: el.querySelector('[data-testid*="title"]')?.innerText || null,
          price: el.querySelector('[data-testid*="price"]')?.innerText || null,
          features: Array.from(
            el.querySelectorAll('[data-testid*="feature"]')
          ).map((f) => f.innerText),
        });
      });
      return results;
    });

    await browser.close();

    return { success: true, count: cars.length, data: cars };
  } catch (err) {
    await browser.close();
    return { success: false, error: err.message };
  }
}

// Run directly (example usage)
if (require.main === module) {
  (async () => {
    const results = await scrapeCars("Delhi", "2025-09-20", "2025-09-25");
    console.log(JSON.stringify(results, null, 2));
  })();
}

module.exports = { scrapeCars };
