const BaseService = require('./BaseService');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');

class UserService extends BaseService {
    constructor() {
        super(User);
    }

    // Validation rules cho user
    userRules = {
        username: { required: true, minLength: 3, maxLength: 50 },
        email: { required: true },
        password: { required: true, minLength: 6 },
        role: { required: true }
    };

    // Lấy tất cả users
    async getAllUsers() {
        return await this.findAll({
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']]
        });
    }

    // Lấy user theo ID
    async getUserById(id) {
        const user = await this.findById(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        return user;
    }

    // Tạo user mới
    async createUser(userData) {
        // Validate dữ liệu
        this.validate(userData, this.userRules);

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('Email đã tồn tại');
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Tạo user mới
        const newUser = await this.create({
            ...userData,
            password: hashedPassword
        });

        // Trả về user không có password
        const { password, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;
    }

    // Cập nhật user
    async updateUser(id, userData) {
        // Validate dữ liệu
        this.validate(userData, this.userRules);

        // Nếu có cập nhật mật khẩu
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // Cập nhật user
        const updatedUser = await this.update(id, userData);
        
        // Trả về user không có password
        const { password, ...userWithoutPassword } = updatedUser.toJSON();
        return userWithoutPassword;
    }

    // Xóa user
    async deleteUser(id) {
        return await this.delete(id);
    }

    // Tìm kiếm user theo email
    async findUserByEmail(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        return user;
    }

    // Kiểm tra mật khẩu
    async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    // Đổi mật khẩu
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.getUserById(userId);
        
        // Kiểm tra mật khẩu cũ
        const isMatch = await this.verifyPassword(user, oldPassword);
        if (!isMatch) {
            throw new Error('Mật khẩu cũ không đúng');
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Cập nhật mật khẩu
        await this.update(userId, { password: hashedPassword });
        
        return { message: 'Đổi mật khẩu thành công' };
    }
}

module.exports = new UserService(); 