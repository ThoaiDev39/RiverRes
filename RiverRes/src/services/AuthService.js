const jwt = require('jsonwebtoken');
const userService = require('./UserService');

class AuthService {
    // Đăng ký tài khoản mới
    async register(userData) {
        try {
            // Nếu không có role, mặc định là user
            if (!userData.role) {
                userData.role = 'user';
            }

            // Tạo user mới
            const user = await userService.createUser(userData);
            
            // Tạo token
            const token = this.generateToken(user);

            return {
                user,
                token,
                message: 'Đăng ký thành công'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Đăng nhập
    async login(email, password) {
        try {
            // Tìm user theo email
            const user = await userService.findUserByEmail(email);

            // Kiểm tra mật khẩu
            const isMatch = await userService.verifyPassword(user, password);
            if (!isMatch) {
                throw new Error('Email hoặc mật khẩu không đúng');
            }

            // Tạo token
            const token = this.generateToken(user);

            // Trả về thông tin user không có password
            const { password: _, ...userWithoutPassword } = user.toJSON();

            return {
                user: userWithoutPassword,
                token,
                message: 'Đăng nhập thành công'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Tạo token JWT
    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '24h' }
        );
    }

    // Xác thực token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        } catch (error) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    // Đổi mật khẩu
    async changePassword(userId, oldPassword, newPassword) {
        try {
            return await userService.changePassword(userId, oldPassword, newPassword);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Quên mật khẩu
    async forgotPassword(email) {
        try {
            const user = await userService.findUserByEmail(email);
            // TODO: Implement password reset logic
            return { message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Đặt lại mật khẩu
    async resetPassword(token, newPassword) {
        try {
            // Verify token
            const decoded = this.verifyToken(token);
            
            // Update password
            await userService.updateUser(decoded.id, { password: newPassword });
            
            return { message: 'Đặt lại mật khẩu thành công' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new AuthService(); 