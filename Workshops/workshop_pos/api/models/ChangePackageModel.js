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
  memberId: {
    type: DataTypes.BIGINT,
  },
  payDate: {
    type: DataTypes.DATE,
  },
  payHour: {
    type: DataTypes.BIGINT,
  },
  payMinute: {
    type: DataTypes.BIGINT,
  },
  payRemark: {
    type: DataTypes.STRING,
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// ChangePackageModel.sync({ alter: true });

module.exports = ChangePackageModel;
