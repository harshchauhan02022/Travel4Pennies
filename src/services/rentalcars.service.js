const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeKayakCars(city, pickupDate, dropoffDate) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36"
  );

  try {
    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    const url = `https://www.kayak.com/cars/${encodeURIComponent(
      city
    )}/${formatDate(pickupDate)}/${formatDate(dropoffDate)}`;

    console.log("🌍 Opening:", url);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    // Wait for results
    await page.waitForSelector('[class*="carResult"]', { timeout: 60000 });

    const cars = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[class*="carResult"]')).map((el) => {
        const name = el.querySelector('[class*="carName"]')?.innerText.trim() || "N/A";
        const price = el.querySelector('[class*="carPrice"]')?.innerText.trim() || "N/A";
        const supplier = el.querySelector('[class*="carSupplier"]')?.innerText.trim() || "N/A";
        const image = el.querySelector('img')?.src || null;
        const bookingLink = el.querySelector('a')?.href || window.location.href;
        return { name, price, supplier, image, bookingLink };
      });
    });


    await browser.close();

    return { success: true, count: cars.length, data: cars };
  } catch (err) {
    await browser.close();
    console.error("❌ Kayak Scraper Error:", err);
    return { success: false, error: "Scraping failed", details: err.message };
  }
}

module.exports = { scrapeKayakCars };
