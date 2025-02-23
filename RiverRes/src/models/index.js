// file này dùng để đồng bộ model với database
const sequelize = require('../config/db');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Sử dụng alter để cập nhật bảng mà không xóa dữ liệu
        console.log('✅ Database đã được đồng bộ');
    } catch (error) {
        console.error('❌ Lỗi đồng bộ database:', error);
    }
};

module.exports = { syncDatabase };
