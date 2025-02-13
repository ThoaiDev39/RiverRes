const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối DB

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ràng buộc phải là email hợp lệ
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',  // Mặc định là 'user'
    validate: {
      isIn: [['user', 'admin']],  // Chỉ có thể là 'user' hoặc 'admin'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'Users', // Đặt tên bảng là 'users'
  timestamps: false, // Tắt tự động thêm createdAt và updatedAt
});

module.exports = User;
