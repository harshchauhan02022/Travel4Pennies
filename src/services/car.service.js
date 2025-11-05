const amadeus = require('../utils/amadeusClient');

async function searchCars(pickupLocation, pickupDateTime, returnDateTime, currency = 'USD') {
    try {
        // ✅ अगर Amadeus Client undefined है या carRentals API unavailable है (sandbox में)
        if (!amadeus.shopping?.carRentals?.get) {
            console.log("⚠️ Amadeus sandbox में Car Rentals API unavailable है — dummy data भेजा जा रहा है।");

            return [
                {
                    id: "1",
                    supplier: "HERTZ",
                    name: "Compact Sedan",
                    price: "350.00",
                    currency,
                    pickupLocation,
                    pickupDateTime,
                    returnLocation: pickupLocation,
                    returnDateTime,
                    bookingLink: `https://www.booking.com/searchresults.html?ss=${pickupLocation}+car+Sedan`
                },
                {
                    id: "2",
                    supplier: "AVIS",
                    name: "SUV Premium",
                    price: "480.00",
                    currency,
                    pickupLocation,
                    pickupDateTime,
                    returnLocation: pickupLocation,
                    returnDateTime,
                    bookingLink: `https://www.booking.com/searchresults.html?ss=${pickupLocation}+car+SUV`
                }
            ];
        }

        const response = await amadeus.shopping.carRentals.get({
            pickupLocation,
            pickupDateTime,
            returnDateTime,
            currencyCode: currency,
            max: 10
        });

        return response.data.map(car => ({
            id: car.id,
            supplier: car.vehicle.vendorCode,
            name: car.vehicle.description || "N/A",
            price: car.price.total,
            currency: car.price.currency,
            pickupLocation: car.pickup.location.code,
            pickupDateTime: car.pickup.dateTime,
            returnLocation: car.dropOff.location.code,
            returnDateTime: car.dropOff.dateTime,
            bookingLink: car.links?.booking || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(car.vehicle.description)}`
        }));

    } catch (error) {
        console.error("Failed to fetch car rentals from Amadeus:", error.response?.data || error.message);

        return [
            {
                id: "X1",
                supplier: "DEFAULT",
                name: "Economy Hatchback",
                price: "299.99",
                currency,
                pickupLocation,
                pickupDateTime,
                returnLocation: pickupLocation,
                returnDateTime,
                bookingLink: `https://www.booking.com/searchresults.html?ss=${pickupLocation}+car`
            }
        ];
    }
}

module.exports = { searchCars };
