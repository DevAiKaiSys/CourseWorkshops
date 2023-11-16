const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const BankModel = sequelize.define('bank', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  bankType: {
    type: DataTypes.STRING,
  },
  bankCode: {
    type: DataTypes.STRING,
  },
  bankName: {
    type: DataTypes.STRING,
  },
  bankBranch: {
    type: DataTypes.STRING,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// BankModel.sync({ alter: true });

module.exports = BankModel;
