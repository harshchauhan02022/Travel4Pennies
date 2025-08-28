const axios = require("axios");

const AMADEUS_BASE = "https://test.api.amadeus.com";

async function getAccessToken() {
  try {
    const response = await axios.post(
      `${AMADEUS_BASE}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getAccessToken, AMADEUS_BASE };
