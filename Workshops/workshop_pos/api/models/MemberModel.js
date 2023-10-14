const { DataTypes } = require('sequelize');
const sequelize = require('../connect');
const PackageModel = require('./PackageModel');

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

// method 1 ไม่แนะนำ ข้อมูลจะเยอะเกินไป server ทำงานหนัก
// MemberModel.belongsTo(PackageModel);
// method 2 เพิ่มที่ api route ที่จะใช้เท่านั้น server จะได้ทำงานเบาลง

module.exports = MemberModel;
