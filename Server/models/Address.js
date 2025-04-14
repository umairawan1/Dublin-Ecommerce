const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Address = sequelize.define('Address', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Address;
