const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const MemberModel = sequelize.define('member', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  packageId: {
    type: DataTypes.BIGINT,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  phone: {
    type: DataTypes.STRING(255),
  },
  pass: {
    type: DataTypes.STRING(255),
  },
});

// เปิดใช้เฉพาะตอนอัพเดทไม่แนะนำให้เปิดตลอด
// MemberModel.sync({ alter: true });

module.exports = MemberModel;
