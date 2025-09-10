const puppeteer = require("puppeteer");

async function scrapeHotels(city, checkIn, checkOut) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36"
    );

    try {
        // ✅ Dynamic booking.com search URL
        const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
            city
        )}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&group_children=0&selected_currency=USD`;

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000,
        });

        await page.waitForSelector('[data-testid="property-card"]');

        const hotels = await page.evaluate(() => {
            return Array.from(
                document.querySelectorAll('[data-testid="property-card"]')
            ).map((el) => {
                const name = el.querySelector('[data-testid="title"]')?.innerText.trim();
                const price =
                    el.querySelector('[data-testid="price-and-discounted-price"]')
                        ?.innerText.trim() || "N/A";
                const link = el.querySelector("a")?.href;
                const image = el.querySelector("img")?.src || null;


                return { name, price, link, image };
            });
        });

        await browser.close();
        return hotels;
    } catch (err) {
        await browser.close();
        throw err;
    }
}

module.exports = { scrapeHotels };