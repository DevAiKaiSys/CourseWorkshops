const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const ProductImageModel = sequelize.define('productImage', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  imageName: {
    type: DataTypes.STRING,
  },
  isMain: {
    type: DataTypes.BOOLEAN,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// ProductImageModel.sync({ alter: true });

module.exports = ProductImageModel;
