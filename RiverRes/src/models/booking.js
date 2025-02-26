const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Hall = require("./hall");
const Menu = require("./menu");
const User = require("./Users");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATEONLY, // Chỉ lưu ngày (yyyy-mm-dd)
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME, // Lưu giờ bắt đầu (hh:mm:ss)
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME, // Lưu giờ kết thúc (hh:mm:ss)
    allowNull: false,
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending",
  },
});

// Thiết lập quan hệ
User.hasMany(Booking, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId" });

Hall.hasMany(Booking, { foreignKey: "hallId", onDelete: "CASCADE" });
Booking.belongsTo(Hall, { foreignKey: "hallId" });

Menu.hasMany(Booking, { foreignKey: "menuId", onDelete: "CASCADE" });
Booking.belongsTo(Menu, { foreignKey: "menuId" });

module.exports = Booking;
