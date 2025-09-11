const puppeteer = require("puppeteer");

exports.scrapeRugged = async (pickup, dropoff, startDate, endDate) => {
  const url = `https://reservations.ruggedrental.com/vehicles/?pickup=${encodeURIComponent(
    pickup
  )}&dropoff=${encodeURIComponent(dropoff)}&from=${startDate}&to=${endDate}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.waitForSelector(".vehicle-card", { timeout: 30000 });

    const vehicles = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll(".vehicleItem").forEach(card => {
        const name = card.querySelector(".vehicleName")?.innerText.trim() || null;
        const price = card.querySelector(".vehicleRate")?.innerText.trim() || null;
        const seats = card.querySelector(".vehicleSeats")?.innerText.trim() || null;
        const transmission = card.querySelector(".vehicleTransmission")?.innerText.trim() || null;
        const image = card.querySelector("img")?.src || null;
    
        if (name && price) {
          results.push({ name, seats, transmission, price, image });
        }
      });
      return results;
    });
    

    await browser.close();
    return vehicles;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
