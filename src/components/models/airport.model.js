const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Airport = sequelize.define("Airport", {
    code: { 
        type: DataTypes.STRING, 
        primaryKey: true  // ✅ this is your PK now
    },
    name: DataTypes.STRING,
    cityCode: DataTypes.STRING,
    cityName: DataTypes.STRING,
    countryName: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    timezone: DataTypes.STRING,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING,
    numAirports: DataTypes.INTEGER,
    city: DataTypes.ENUM("true", "false"),
}, {
    tableName: "airports",
    timestamps: false,
});

module.exports = Airport;
