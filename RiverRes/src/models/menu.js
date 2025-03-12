// Hoàng Hà
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Dish = require("../models/dish");

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
  totalPrice: {  // 🔹 Tính tổng giá dựa trên món ăn
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  }
});

// Quan hệ: 1 Menu có nhiều Dish
Menu.hasMany(Dish, { foreignKey: "menuId", onDelete: "CASCADE" });
Dish.belongsTo(Menu, { foreignKey: "menuId" });

// Hàm tính lại tổng giá menu
async function updateTotalPrice(menuId) {
  const dishes = await Dish.findAll({ where: { menuId } });
  const totalPrice = dishes.reduce((sum, dish) => sum + parseFloat(dish.price || 0), 0);
  await Menu.update({ totalPrice }, { where: { id: menuId } });
}

// Hook cập nhật `totalPrice` khi có thay đổi
Dish.addHook("afterCreate", async (dish) => {
  await updateTotalPrice(dish.menuId);
});
Dish.addHook("afterUpdate", async (dish) => {
  await updateTotalPrice(dish.menuId);
});
Dish.addHook("afterDestroy", async (dish) => {
  await updateTotalPrice(dish.menuId);
});


module.exports = Menu;
