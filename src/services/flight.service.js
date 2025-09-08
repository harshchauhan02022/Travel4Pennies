const puppeteer = require("puppeteer");

exports.scrapeFlights = async (from, to, departDate, returnDate) => {
  const url = `https://www.booking.com/flights/index.html?origin=${from}&destination=${to}&depart=${departDate}${returnDate ? `&return=${returnDate}` : ""}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait until loader disappears (important for Booking)
    try {
      await page.waitForSelector('[data-testid="search_loader"]', { timeout: 15000 });
      await page.waitForSelector('[data-testid="search_loader"]', { hidden: true, timeout: 60000 });
    } catch (e) {
      console.log("Loader not found, continuing...");
    }

    // Now wait for flights
    await page.waitForSelector('[data-testid="flight_card_outer"], [data-testid="flight_card_segment"]', { timeout: 60000 });

    const flights = await page.evaluate(() => {
      let results = [];
      const cards = document.querySelectorAll('[data-testid="flight_card_outer"], [data-testid="flight_card_segment"]');

      cards.forEach(el => {
        results.push({
          airline: el.querySelector('[data-testid="flight_card_carrier"]')?.innerText || null,
          departure: el.querySelector('[data-testid="flight_card_segment_departure_time"]')?.innerText || null,
          arrival: el.querySelector('[data-testid="flight_card_segment_arrival_time"]')?.innerText || null,
          duration: el.querySelector('[data-testid="flight_card_segment_duration"]')?.innerText || null,
          price: el.querySelector('[data-testid="flight_card_price_main_price"]')?.innerText?.replace("US$", "$") || null,
          link: window.location.href
        });
      });

      return results;
    });

    await browser.close();

    if (!flights || flights.length === 0) {
      throw new Error("No flights found – check route or date");
    }

    return flights;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
