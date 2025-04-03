require('dotenv').config();

const express = require('express');
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');

const webRoutes = require('./routes/web');
const authRoutes = require('./routes/Auth'); // Import API routes
const userRoutes = require('./routes/userRouter');
const menuRoutes = require("./routes/menuRoutes");
const dishRoutes = require("./routes/dishRoutes");
const hallRoutes = require("./routes/hallRoutes");
const eventRoutes = require("./routes/eventRoutes");

const sequelize = require('./config/db'); // Kết nối database

const app = express();
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME || 'localhost';

// ✅ Middleware xử lý JSON
app.use(express.json());

// ✅ Cấu hình CORS (nếu frontend gọi API từ domain khác)
app.use(cors());

// ✅ Cấu hình template engine (nếu có)
configViewEngine(app);

// ✅ Định nghĩa routes
app.use('/', webRoutes);
app.use('/auth', authRoutes); // API đăng nhập & đăng ký
app.use("/api/menu", menuRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/hall", hallRoutes);
app.use("/api/event", eventRoutes);
app.use('/api', userRoutes); // Đặt route chung xuống cuối

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
