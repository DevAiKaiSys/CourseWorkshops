const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const ChangePackageModel = sequelize.define('changePackage', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  packageId: {
    type: DataTypes.BIGINT,
  },
  userId: {
    type: DataTypes.BIGINT,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// ChangePackageModel.sync({ alter: true });

module.exports = ChangePackageModel;
