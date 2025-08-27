const axios = require("axios");
require("dotenv").config();

const AMADEUS_BASE = process.env.AMADEUS_BASE;
const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

let tokenCache = null;
let tokenExpiry = null;

async function getAccessToken() {
    if (tokenCache && tokenExpiry && new Date() < tokenExpiry) {
        return tokenCache;
    }

    const response = await axios.post(`${AMADEUS_BASE}/v1/security/oauth2/token`, null, {
        params: {
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    tokenCache = response.data.access_token;
    tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    return tokenCache;
}

module.exports = { getAccessToken };
