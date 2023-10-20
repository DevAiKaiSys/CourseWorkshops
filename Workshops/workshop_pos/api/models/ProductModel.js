const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const ProductModel = sequelize.define('product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  barcode: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  cost: {
    type: DataTypes.BIGINT,
  },
  price: {
    type: DataTypes.BIGINT,
  },
  detail: {
    type: DataTypes.STRING,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// ProductModel.sync({ alter: true });

module.exports = ProductModel;
