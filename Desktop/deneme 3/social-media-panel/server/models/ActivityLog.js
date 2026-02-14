const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ActivityLog = sequelize.define("ActivityLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eylem: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

module.exports = ActivityLog;
