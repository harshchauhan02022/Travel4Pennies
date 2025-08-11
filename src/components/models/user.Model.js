const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); // Adjust if needed

const User = sequelize.define('User', {
    full_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;
