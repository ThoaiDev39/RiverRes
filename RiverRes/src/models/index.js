// file này dùng để đồng bộ model với database
const sequelize = require('../config/db');
const Dish = require('./dish');
const Menu = require('./menu');
const Hall = require('./hall');
const Booking = require('./booking');

const syncDatabase = async () => {
    try {
        await  sequelize.sync({ force: true, alter: true});  // Sử dụng alter để cập nhật bảng mà không xóa dữ liệu
        console.log('✅ Database đã được đồng bộ');
    } catch (error) {
        console.error('❌ Lỗi đồng bộ database:', error);
    }
};

module.exports = { syncDatabase , Dish, Menu, Hall, Booking };
