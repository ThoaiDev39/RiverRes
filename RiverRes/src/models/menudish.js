const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Menu = require("./menu");
const Dish = require("./dish");

const MenuDish = sequelize.define("MenuDish", {
  menuId: {
    type: DataTypes.INTEGER,
    references: {
      model: Menu,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  dishId: {
    type: DataTypes.INTEGER,
    references: {
      model: Dish,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, { timestamps: false });

Menu.belongsToMany(Dish, { through: MenuDish, foreignKey: "menuId" });
Dish.belongsToMany(Menu, { through: MenuDish, foreignKey: "dishId" });

module.exports = MenuDish;
