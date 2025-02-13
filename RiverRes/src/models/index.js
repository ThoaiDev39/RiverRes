// file này dùng để đồng bộ model vs database
const sequelize = require('../config/db')
const Users = require('../models/Users')

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false, after: true }); // { force: true } sẽ xóa bảng cũ rồi tạo mới {after: true}
                                                        //giúp tự động tạo bảng users nếu chưa có hoặc cập nhật bảng nếu có thay đổi.
        console.log('Database đã được đồng bộ');
    } catch (error) {
        console.error('Lỗi đồng bộ database:', error);
    }
};

module.exports = { Users, syncDatabase };