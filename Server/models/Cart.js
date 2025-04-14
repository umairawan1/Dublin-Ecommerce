const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Make sure you have this model defined

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

Cart.associate = (models) => {
  Cart.belongsTo(models.User, { foreignKey: 'userId' });
  Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
};

module.exports = Cart;
