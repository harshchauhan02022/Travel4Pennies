const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db"); // your db connection

const Airport = sequelize.define("Airport", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ident: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    elevation_ft: DataTypes.INTEGER,
    continent: DataTypes.STRING,
    iso_country: DataTypes.STRING,
    iso_region: DataTypes.STRING,
    municipality: DataTypes.STRING,
    gps_code: DataTypes.STRING,
    iata_code: DataTypes.STRING,
    local_code: DataTypes.STRING,
    latitude_deg: DataTypes.FLOAT,
    longitude_deg: DataTypes.FLOAT,
}, {
    tableName: "airports",
    timestamps: false,
});

module.exports = Airport;
