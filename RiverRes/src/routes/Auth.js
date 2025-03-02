const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Import model User
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// 📌 API Đăng ký (dành cho cả user và admin)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại!' });

        let userRole = 'user'; // Mặc định tất cả tài khoản mới đều là user

        // Chỉ admin mới có quyền tạo tài khoản với role là 'admin'
        if (role === 'admin') {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền tạo tài khoản admin!' });
            }
            userRole = 'admin';
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới với quyền xác định
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: userRole
        });

        res.status(201).json({ message: `Tạo tài khoản ${userRole} thành công!`, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!', error });
    }
});



// 📌 API Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });

        // Kiểm tra mật khẩu có khớp không
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });

        // Tạo token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Đăng nhập thành công!', token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ!', error });
    }
});

module.exports = router;
