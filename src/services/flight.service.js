const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Utility: Convert "07:55" + baseDate => ISO datetime
function formatDateTime(baseDate, timeStr) {
  if (!timeStr) return "";

  let nextDay = timeStr.includes("+1");
  let cleanTime = timeStr.replace("+1", "").trim();

  let [hh, mm] = cleanTime.split(":").map(Number);

  let dateObj = new Date(baseDate);
  dateObj.setHours(hh, mm, 0, 0);

  if (nextDay) {
    dateObj.setDate(dateObj.getDate() + 1);
  }

  return dateObj.toISOString();
}

async function scrapeFlights(from, to, departDate, returnDate) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // US user-agent set karna zaroori hai
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  // URL with return date
  const url = `https://www.kayak.co.in/flights/${from}-${to}/${departDate}/${returnDate}?sort=bestflight_a`;

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 8000));

  // Check captcha
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes("Please verify you are a human")) {
    throw new Error("Captcha detected. Kayak blocked this request.");
  }

  // Flexible selector
  await page.waitForSelector("div.resultWrapper, div.resultCard, .nrc6", { timeout: 90000 });

  const flights = await page.evaluate(() => {
    const results = [];

    document.querySelectorAll(".nrc6").forEach((el) => {
      const raw = el.innerText;

      // Airline
      const airline = raw.split("\n").map(l => l.trim()).filter(Boolean).pop();

      // Price
      const priceMatch = raw.match(/₹\s?[\d,]+/);
      const price = priceMatch ? priceMatch[0] : "";

      // Departure & Arrival times
      const times = raw.match(/(\d{1,2}:\d{2}(?:\+\d)?)/g) || [];
      const depart = times[0] || "";
      const arrive = times[1] || "";

      // Duration
      const durationMatch = raw.match(/(\d+h\s?\d+m|\d+h)/);
      const duration = durationMatch ? durationMatch[0] : "";

      // Stops
      let stops = "Direct";
      if (raw.toLowerCase().includes("stopover")) {
        const stopMatch = raw.match(/(\d+h\s?\d+m stopover .+)/);
        stops = stopMatch ? stopMatch[0] : "With Stops";
      } else if (raw.toLowerCase().includes("direct")) {
        stops = "Direct";
      }

      // Booking link
      const bookingLink = el.querySelector("a")?.href || "";

      results.push({
        airline,
        price,
        depart,
        arrive,
        duration,
        stops,
        bookingLink,
      });
    });

    return results;
  });

  // Map with proper datetime
  const formattedFlights = flights.map((f) => ({
    airline: f.airline,
    price: f.price,
    depart: f.depart,
    departDateTime: formatDateTime(departDate, f.depart),
    arrive: f.arrive,
    arriveDateTime: formatDateTime(departDate, f.arrive),
    duration: f.duration,
    stops: f.stops,
    bookingLink: f.bookingLink,
  }));

  await browser.close();
  return formattedFlights;
}

module.exports = { scrapeFlights };
