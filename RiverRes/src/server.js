require('dotenv').config();
const express = require('express');
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const authRoutes = require('./routes/Auth'); 
const userRoutes = require('./routes/userRouter');
const menuRoutes = require("./routes/menuRoutes");
const dishRoutes = require("./routes/dishRoutes");
const hallRoutes = require("./routes/hallRoutes");
const eventRoutes = require("./routes/eventRoutes");
const sequelize = require('./config/db'); 
const TimeSlot = require('./models/timeSlot'); 
const Image = require('./models/Image'); 
const app = express();
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME || 'localhost';

app.use(express.json());
app.use(cors());
configViewEngine(app);

// Định nghĩa routes
app.use('/', webRoutes);
app.use('/auth', authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/hall", hallRoutes);
app.use("/api/event", eventRoutes);
app.use('/api', userRoutes); 

// Hàm kiểm tra và tạo TimeSlots mặc định
async function checkAndCreateTimeSlots() {
  try {
    // Kiểm tra xem đã có TimeSlot nào chưa
    const existingSlots = await TimeSlot.findAll();
    
    if (existingSlots.length === 0) {
      console.log('Không tìm thấy TimeSlot nào. Đang tạo các TimeSlot mặc định...');
      
      // Tạo các TimeSlot mặc định
      const defaultTimeSlots = [
        {
          name: 'Buổi sáng',
          startTime: '08:00:00',
          endTime: '14:00:00',
          description: 'Khung giờ buổi sáng từ 8h đến 14h'
        },
        {
          name: 'Buổi chiều',
          startTime: '15:00:00',
          endTime: '20:00:00',
          description: 'Khung giờ buổi chiều từ 15h đến 20h'
        },
        {
          name: 'Buổi tối',
          startTime: '17:00:00',
          endTime: '23:00:00',
          description: 'Khung giờ buổi tối từ 17h đến 23h'
        }
      ];
      
      await TimeSlot.bulkCreate(defaultTimeSlots);
      console.log('✅ Đã tạo các TimeSlot mặc định thành công!');
    } else {
      console.log(`✅ Đã có ${existingSlots.length} TimeSlot trong cơ sở dữ liệu.`);
    }
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra/tạo TimeSlot:', error);
  }
}

// Kết nối database & khởi động server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối MySQL thành công với Sequelize!');
    return sequelize.sync({ alter: true }); // Cập nhật bảng nếu có thay đổi
  })
  .then(() => {
    // Kiểm tra và tạo TimeSlots nếu cần
    return checkAndCreateTimeSlots();
  })
  .then(() => {
    app.listen(port, hostname, () => {
      console.log(`🚀 Server đang chạy tại http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối database:', err);
  });

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error('💥 Lỗi hệ thống:', err);
  res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ!' });
});
