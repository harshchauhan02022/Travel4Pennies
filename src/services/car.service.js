const amadeus = require('../utils/amadeusClient');

async function searchCars(pickupLocation, pickupDateTime, returnDateTime, currency = 'USD') {
    // Sandbox safe fallback (Amadeus free API may not have carRentals)
    if (!amadeus.shopping?.carRentals?.get) {
        // Return dummy cars for testing
        return [
            {
                id: "1",
                supplier: "HERTZ",
                name: "Sedan",
                price: "350.00",
                currency,
                pickupLocation,
                pickupDateTime,
                returnLocation: pickupLocation,
                returnDateTime,
                bookingLink: `https://www.booking.com/searchresults.html?ss=${pickupLocation}+Sedan`
            },
            {
                id: "2",
                supplier: "AVIS",
                name: "SUV",
                price: "450.00",
                currency,
                pickupLocation,
                pickupDateTime,
                returnLocation: pickupLocation,
                returnDateTime,
                bookingLink: `https://www.booking.com/searchresults.html?ss=${pickupLocation}+SUV`
            }
        ];
    }

    // Production call
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
}

module.exports = { searchCars };
