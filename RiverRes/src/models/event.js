const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Hall = require("./hall");
const Menu = require("./menu");
const User = require("./Users");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  numberOfTables: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "paid"),
    defaultValue: "pending",
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2), // 🔹 Dùng DECIMAL thay vì FLOAT
    allowNull: false,
    defaultValue: 0,
  },
});

// Định nghĩa quan hệ
User.hasMany(Event, { foreignKey: "userId", onDelete: "CASCADE" });
Event.belongsTo(User, { foreignKey: "userId" });

Hall.hasMany(Event, { foreignKey: "hallId", onDelete: "CASCADE" });
Event.belongsTo(Hall, { foreignKey: "hallId" });

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
