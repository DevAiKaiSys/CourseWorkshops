const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const BillSaleDetailModel = sequelize.define('billSaleDetail', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  billSaleId: {
    type: DataTypes.BIGINT,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  qty: {
    type: DataTypes.BIGINT,
  },
  qty: {
    type: DataTypes.BIGINT,
  },
  price: {
    type: DataTypes.BIGINT,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// BillSaleDetailModel.sync({ alter: true });

module.exports = BillSaleDetailModel;
