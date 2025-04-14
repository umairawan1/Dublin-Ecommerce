const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('e_commerce', 'root', 'abcdefgh', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
