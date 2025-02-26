const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Hall = sequelize.define("Hall", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // URL ảnh sảnh tiệc
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Hall;
