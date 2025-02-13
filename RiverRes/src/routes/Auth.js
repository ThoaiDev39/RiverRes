const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Import model User
const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Mặc định gán quyền 'user'
        const userRole = 'user'; // Mặc định quyền người dùng là 'user'

        // Tạo user mới với quyền là 'user'
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: userRole, // Thêm role vào đây
        });
        
        res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem user có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        res.json({ message: 'Đăng nhập thành công!', token });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});

module.exports = router;
