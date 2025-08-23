const axios = require("axios");

const BASE = process.env.AMADEUS_BASE || "https://test.api.amadeus.com";
const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

let tokenCache = {
    access_token: null,
    expires_at: 0
};

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);

    if (tokenCache.access_token && tokenCache.expires_at > now + 30) {
        return tokenCache.access_token;
    }

    const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    });

    const res = await axios.post(`${BASE}/v1/security/oauth2/token`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const { access_token, expires_in } = res.data;
    tokenCache.access_token = access_token;
    tokenCache.expires_at = now + (expires_in || 1800);

    return access_token;
}

module.exports = { getAccessToken, BASE };
