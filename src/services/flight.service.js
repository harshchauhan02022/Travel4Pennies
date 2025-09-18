const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

function formatDateTime(baseDate, timeStr) {
  try {
    if (!baseDate || !timeStr) {
      console.warn("⚠️ formatDateTime missing data:", { baseDate, timeStr });
      return null;
    }

    // Handle +1
    let nextDay = timeStr.includes("+1");
    let cleanTime = timeStr.replace("+1", "").trim();

    // Split time safely
    const parts = cleanTime.split(":");
    if (parts.length < 2) {
      console.warn("⚠️ Invalid time string:", timeStr);
      return null;
    }

    let [hh, mm] = parts.map(Number);

    const dateObj = new Date(baseDate);
    if (isNaN(dateObj.getTime())) {
      console.warn("⚠️ Invalid baseDate:", baseDate);
      return null;
    }

    dateObj.setHours(hh, mm, 0, 0);

    if (nextDay) {
      dateObj.setDate(dateObj.getDate() + 1);
    }

    return dateObj.toISOString();
  } catch (err) {
    console.error("❌ formatDateTime error:", err.message, { baseDate, timeStr });
    return null;
  }
}

async function scrapeFlights(from, to, departDate, returnDate, limit = 10) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  const url = `https://www.kayak.co.in/flights/${from}-${to}/${departDate}/${returnDate}?sort=bestflight_a`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait until first flight appears
  await page.waitForSelector(".nrc6", { timeout: 15000 });

  // ⏱ Hard cap: max 10 sec wait
  const MAX_WAIT = 10000;
  const start = Date.now();

  while (Date.now() - start < MAX_WAIT) {
    const count = await page.$$eval(".nrc6", els => els.length);
    if (count >= 8) break; // stop once 8 flights visible
    await new Promise(r => setTimeout(r, 1000));
  }

  // Scrape results
  let flights = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll(".nrc6").forEach((el) => {
      const raw = el.innerText;

      const airline = raw.split("\n").map(l => l.trim()).filter(Boolean).pop();
      const priceMatch = raw.match(/₹\s?[\d,]+/);
      const price = priceMatch ? priceMatch[0] : "";

      const times = raw.match(/(\d{1,2}:\d{2}(?:\+\d)?)/g) || [];
      const depart = times[0] || "";
      const arrive = times[1] || "";

      const durationMatch = raw.match(/(\d+h\s?\d+m|\d+h)/);
      const duration = durationMatch ? durationMatch[0] : "";

      let stops = "Direct";
      if (raw.toLowerCase().includes("stopover")) {
        const stopMatch = raw.match(/(\d+h\s?\d+m stopover .+)/);
        stops = stopMatch ? stopMatch[0] : "With Stops";
      }

      const bookingLink = el.querySelector("a")?.href || "";

      results.push({ airline, price, depart, arrive, duration, stops, bookingLink });
    });
    return results;
  });

  await browser.close();

  // 🔢 Apply limit (default 10)
  if (limit && flights.length > limit) {
    flights = flights.slice(0, limit);
  }

  return flights;
}


module.exports = { scrapeFlights };
