const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dish = sequelize.define("Dish", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT, // 🔹 Dùng FLOAT nếu không cần độ chính xác cao
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // 🔹 URL ảnh món ăn
  },
});

module.exports = Dish;
