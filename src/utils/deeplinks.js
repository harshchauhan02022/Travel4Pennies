function encode(v) {
    return encodeURIComponent(v || "");
}

/**
 * Expedia flight deep link (roundtrip)
 */
function expediaFlightDeeplink({ origin, destination, departDate, returnDate, adults = 1 }) {
    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const leg1 = `from:${origin},to:${destination},departure:${formatDate(departDate)}TANYT`;
    const leg2 = returnDate
        ? `&leg2=from:${destination},to:${origin},departure:${formatDate(returnDate)}TANYT`
        : "";

    return `https://www.expedia.com/Flights-Search?trip=${returnDate ? "roundtrip" : "oneway"}&leg1=${encodeURIComponent(
        leg1
    )}${returnDate ? encodeURIComponent(leg2) : ""}&passengers=adults:${adults}&options=cabinclass:economy&mode=search`;
}

/**
 * Booking.com hotel deeplink by hotel + city
 */
function bookingHotelDeeplink({ hotelName, city, checkIn, checkOut, adults = 1 }) {
    const base = "https://www.booking.com/searchresults.html";
    const params =
        `?ss=${encode(hotelName + " " + city)}` +
        `&checkin=${checkIn}` +
        `&checkout=${checkOut}` +
        `&group_adults=${adults}&no_rooms=1`;
    return base + params;
}

/**
 * Expedia city-based hotel search
 */
function expediaHotelCityDeeplink({ city, checkIn, checkOut, adults = 1 }) {
    const base = "https://www.expedia.com/Hotel-Search";
    const params = `?destination=${encode(city)}&startDate=${encode(checkIn)}&endDate=${encode(checkOut)}&adults=${adults}`;
    return base + params;
}

module.exports = {
    expediaFlightDeeplink,
    bookingHotelDeeplink,
    expediaHotelCityDeeplink,
};
