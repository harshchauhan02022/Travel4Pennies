const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Car = sequelize.define("Car", {
  resultId: { type: DataTypes.STRING },
  brand: { type: DataTypes.STRING },
  carClass: { type: DataTypes.STRING },
  doorCount: { type: DataTypes.INTEGER },
  bagCount: { type: DataTypes.INTEGER },
  adultCount: { type: DataTypes.INTEGER },
  price: { type: DataTypes.FLOAT },
  currency: { type: DataTypes.STRING },
  bookingUrl: { type: DataTypes.TEXT },
  siteName: { type: DataTypes.STRING },
  fuelPolicy: { type: DataTypes.STRING },
  paymentType: { type: DataTypes.STRING },
  providerCode: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.TEXT },

  // 🆕 New fields
  cityName: { type: DataTypes.STRING },
  cityCode: { type: DataTypes.STRING },
  pickupDate: { type: DataTypes.DATEONLY },
  returnDate: { type: DataTypes.DATEONLY },
});

module.exports = Car;
