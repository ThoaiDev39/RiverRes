const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
    type: DataTypes.STRING,
  },
});

module.exports = Dish;
