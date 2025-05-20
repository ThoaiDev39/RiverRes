const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Hall = require("./hall");
const Menu = require("./menu");
const User = require("./Users");
const TimeSlot = require("./timeSlot");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  hallId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hall,
      key: "id",
    },
  },
  timeSlotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TimeSlot,
      key: "id",
    },
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: "id",
    },
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  numberOfTables: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "paid", "done", "cancelled"),
    defaultValue: "pending",
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});

// Định nghĩa quan hệ
User.hasMany(Event, { foreignKey: "userId", onDelete: "CASCADE" });
Event.belongsTo(User, { foreignKey: "userId" });

Hall.hasMany(Event, { foreignKey: "hallId", onDelete: "CASCADE" });
Event.belongsTo(Hall, { foreignKey: "hallId" });

TimeSlot.hasMany(Event, { foreignKey: "timeSlotId" });
Event.belongsTo(TimeSlot, { foreignKey: "timeSlotId" });

Menu.hasMany(Event, { foreignKey: "menuId", onDelete: "CASCADE" });
Event.belongsTo(Menu, { foreignKey: "menuId" });

// Hook để tự động tính totalPrice khi tạo/sửa sự kiện
Event.addHook("beforeSave", async (event) => {
  const hall = await Hall.findByPk(event.hallId);
  const menu = await Menu.findByPk(event.menuId);
  
  if (hall && menu) {
    event.totalPrice = event.numberOfTables * menu.totalPrice + hall.price;
  }
});

module.exports = Event;
