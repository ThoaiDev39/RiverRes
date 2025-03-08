const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Menu = require("./menu");

const Dish = sequelize.define("Dish", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Chính xác hơn FLOAT
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
