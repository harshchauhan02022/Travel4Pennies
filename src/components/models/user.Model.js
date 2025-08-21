const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    contact: {
        type: DataTypes.STRING(15),
        allowNull: true 
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_password_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true 
});

module.exports = User;
