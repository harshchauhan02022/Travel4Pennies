const fs = require("fs");

async function fetchKayakCars() {
  try {
    // ✅ JSON file read
    const rawData = fs.readFileSync("E:/New-project/Travel4Pennies/data/carData.json", "utf8");
    const data = JSON.parse(rawData);

    console.log("🚀 Raw Data Loaded. Keys:", Object.keys(data));
    return data;
  } catch (error) {
    console.error("❌ Error reading JSON file:", error.message);
    return null;
  }
}

module.exports = { fetchKayakCars };
