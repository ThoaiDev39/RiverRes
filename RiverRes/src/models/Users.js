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
    type: DataTypes.ENUM('user', 'admin'),  // ENUM giúp hạn chế giá trị nhập vào
    defaultValue: 'user',
  },
  birth: {
    type: DataTypes.DATEONLY, // Dùng DATEONLY thay vì STRING
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true, // Đảm bảo chỉ chứa số
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'Users', // Đặt tên bảng là 'Users'
  timestamps: true, // Tự động tạo createdAt và updatedAt
  createdAt: 'created_at', // Đổi tên mặc định của createdAt
  updatedAt: 'updated_at', // Đổi tên mặc định của updatedAt
});

module.exports = User;
