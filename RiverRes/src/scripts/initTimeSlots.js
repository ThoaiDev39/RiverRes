const TimeSlot = require('../models/timeSlot');
const sequelize = require('../config/db');

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

async function initTimeSlots() {
  try {
    await sequelize.sync();
    
    // Kiểm tra xem đã có TimeSlot nào chưa
    const existingSlots = await TimeSlot.findAll();
    
    if (existingSlots.length === 0) {
      // Nếu chưa có TimeSlot nào, tạo các TimeSlot mặc định
      await TimeSlot.bulkCreate(defaultTimeSlots);
      console.log('Đã tạo các TimeSlot mặc định thành công!');
    } else {
      console.log('Đã có TimeSlot trong cơ sở dữ liệu.');
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo TimeSlot:', error);
  } finally {
    await sequelize.close();
  }
}

// Chạy hàm khởi tạo
initTimeSlots(); 