const Sequelize = require('sequelize');
require('dotenv').config(); // Đảm bảo dotenv được load để lấy các biến môi trường

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost', // Dùng giá trị trong .env nếu có, nếu không dùng localhost
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
});

// Kiểm tra kết nối
sequelize.authenticate()
  .then(() => console.log('Kết nối MySQL thành công'))
  .catch(err => console.error('Lỗi kết nối MySQL:', err));


module.exports = sequelize;
