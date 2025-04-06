const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Đọc config từ file config.json
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

// Tạo kết nối database
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: false
    }
);

// Định nghĩa model TimeSlot
const TimeSlot = sequelize.define('TimeSlot', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    startTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    endTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'TimeSlots',
    timestamps: true
});

// Danh sách time slots mặc định
const defaultTimeSlots = [
    {
        name: 'Sáng',
        startTime: '08:00:00',
        endTime: '12:00:00',
        description: 'Khung giờ buổi sáng'
    },
    {
        name: 'Chiều',
        startTime: '13:00:00',
        endTime: '17:00:00',
        description: 'Khung giờ buổi chiều'
    },
    {
        name: 'Tối',
        startTime: '18:00:00',
        endTime: '22:00:00',
        description: 'Khung giờ buổi tối'
    }
];

async function checkAndCreateTimeSlots() {
    try {
        // Kiểm tra kết nối database
        await sequelize.authenticate();
        console.log('Kết nối database thành công.');

        // Đồng bộ model với database
        await TimeSlot.sync({ force: false });
        console.log('Đã đồng bộ model TimeSlot với database.');

        // Kiểm tra xem đã có time slots chưa
        const existingTimeSlots = await TimeSlot.findAll();
        console.log(`Đã tìm thấy ${existingTimeSlots.length} time slots trong database.`);

        if (existingTimeSlots.length === 0) {
            console.log('Không tìm thấy time slots nào. Đang tạo time slots mặc định...');
            
            // Tạo time slots mặc định
            for (const timeSlot of defaultTimeSlots) {
                await TimeSlot.create(timeSlot);
                console.log(`Đã tạo time slot: ${timeSlot.name}`);
            }
            
            console.log('Đã tạo xong các time slots mặc định.');
        } else {
            console.log('Danh sách time slots hiện có:');
            existingTimeSlots.forEach(slot => {
                console.log(`- ${slot.name}: ${slot.startTime} - ${slot.endTime}`);
            });
        }

    } catch (error) {
        console.error('Lỗi:', error);
    } finally {
        // Đóng kết nối database
        await sequelize.close();
        console.log('Đã đóng kết nối database.');
    }
}

// Chạy hàm kiểm tra và tạo time slots
checkAndCreateTimeSlots(); 