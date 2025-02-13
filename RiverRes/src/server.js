require('dotenv').config();

const express = require('express');
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/Auth'); // Import API routes
const sequelize = require('./config/db'); // Kết nối database

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME || 'localhost';

// ✅ Middleware xử lý JSON
app.use(express.json());

// ✅ Cấu hình CORS (nếu frontend gọi API từ domain khác)
app.use(cors());

// ✅ Cấu hình template engine (nếu có)
configViewEngine(app);

// ✅ Định nghĩa routes
app.use('/', webRoutes);
app.use('/auth', apiRoutes); // API đăng nhập & đăng ký

// ✅ Kết nối database & khởi động server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối MySQL thành công với Sequelize!');
    return sequelize.sync({ alter: true }); // Cập nhật bảng nếu có thay đổi
  })
  .then(() => {
    app.listen(port, hostname, () => {
      console.log(`🚀 Server đang chạy tại http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối database:', err);
  });

// ✅ Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error('💥 Lỗi hệ thống:', err);
  res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ!' });
});
