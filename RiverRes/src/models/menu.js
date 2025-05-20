const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Menu = sequelize.define("Menu", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  totalPrice: {  // 🔹 Không cần tính tổng tự động nữa, có thể tính bằng query
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  image: {  // Added image field
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Menu;
