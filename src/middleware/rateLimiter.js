// Simple in-memory rate limiter for Expedia API
const requestTimes = [];

module.exports = (req, res, next) => {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    // Remove requests outside the current window
    while (requestTimes.length > 0 && requestTimes[0] < windowStart) {
        requestTimes.shift();
    }

    // Check if we've exceeded the limit (5 requests per minute)
    if (requestTimes.length >= 5) {
        return res.status(429).json({
            success: false,
            error: "Too many requests to Expedia API. Please try again later."
        });
    }

    // Add this request time
    requestTimes.push(now);
    next();
};