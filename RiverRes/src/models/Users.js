const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: false, 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isEmail: true, 
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),  
    defaultValue: 'user',
  },
  birth: {
    type: DataTypes.DATEONLY, 
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
      isNumeric: true, 
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
