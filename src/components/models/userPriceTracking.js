const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UserPriceTracking = sequelize.define('UserPriceTracking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hotel_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hotel_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    check_in: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    check_out: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    adults: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    last_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'USD'
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'user_price_tracking'
});

module.exports = UserPriceTracking;
