const Car = require("../models/car.Model");
const { fetchKayakCars } = require("../../services/kayak.service");
const { Op } = require("sequelize");


exports.saveCars = async (req, res) => {
  try {
    const { cityName, cityCode, pickupDate, returnDate } = req.body;
    const data = await fetchKayakCars();

    if (!data) return res.status(500).json({ message: "No data from Kayak" });

    // Purane data delete
    await Car.destroy({ where: { cityCode } });

    const results = [];

    // ✅ agar data.results nahi hai to direct data.providers check karo
    const items = data.combinedResults || [];  // 🔥 use this
    for (const item of items) {
      const providers = item.providers || [];
      for (const p of providers) {
        const carData = {
          resultId: item.resultId || null,
          brand: p.vehicleDetail?.brand || null,
          carClass: p.vehicleDetail?.localizedCarClassName || null,
          doorCount: p.vehicleDetail?.doorCount || null,
          bagCount: p.vehicleDetail?.bagCount || null,
          adultCount: p.vehicleDetail?.adultCount || null,
          price: p.totalPrice?.price || item.price?.price || null,
          currency: p.totalPrice?.currency || item.price?.currency || null,
          bookingUrl: p.bookingUrl?.url || null,
          siteName: p.siteLink?.localizedText || null,   // ✅ better
          fuelPolicy: p.fuelPolicy?.name || null,
          paymentType: p.paymentType || null,
          providerCode: p.code || null,
          imageUrl: item.imageUrl?.url || item.image || null,

          cityName,
          cityCode,
          pickupDate,
          returnDate,
        };

        console.log("🚀 Saving Car:", carData);  // debug
        const car = await Car.create(carData);
        results.push(car);
      }
    }


    res.status(201).json({
      message: "Cars saved successfully",
      cityName,
      cityCode,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("❌ Save Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const { cityName, cityCode, pickupDate, returnDate } = req.query;

    if ((!cityName && !cityCode) || !pickupDate || !returnDate) {
      return res.status(400).json({
        message: "cityName or cityCode required, and pickupDate + returnDate required",
      });
    }

    let where = {};

    // City filter
    if (cityCode) {
      where.cityCode = cityCode;
    } else if (cityName) {
      where.cityName = cityName;
    }

    // Date containment filter
    where.pickupDate = { [Op.lte]: pickupDate };  // DB pickupDate <= search pickupDate
    where.returnDate = { [Op.gte]: returnDate };  // DB returnDate >= search returnDate

    const cars = await Car.findAll({ where });

    res.json({
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.getCars = async (req, res) => {
  try {
    const { cityCode } = req.query; // 🆕 Optional filter
    let where = {};
    if (cityCode) where.cityCode = cityCode;

    const cars = await Car.findAll({ where });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
