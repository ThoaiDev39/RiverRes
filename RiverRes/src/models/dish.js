// Hoàng Hà
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Menu = require("./menu");

const Dish = sequelize.define("Dish", {
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // URL ảnh món ăn
  },
});

// Thiết lập quan hệ: 1 Menu có nhiều Dish
Menu.hasMany(Dish, { foreignKey: "menuId", onDelete: "CASCADE" });
Dish.belongsTo(Menu, { foreignKey: "menuId" });

module.exports = Dish;
