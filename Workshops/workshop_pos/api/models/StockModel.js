const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const StockModel = sequelize.define('stock', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  qty: {
    type: DataTypes.BIGINT,
  },
  userId: { type: DataTypes.BIGINT },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// StockModel.sync({ alter: true });

module.exports = StockModel;
