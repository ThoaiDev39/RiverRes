const express = require('express');
const bcrypt = require('bcryptjs');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/Users');
const userService = require("../services/UserService");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả khách hàng (Chỉ Admin)
 * 🔐 Yêu cầu xác thực & quyền Admin
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy thông tin user theo ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền truy cập
        if (req.user.role !== "admin" && req.user.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập thông tin này" });
        }

        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật thông tin user
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền truy cập
        if (req.user.role !== "admin" && req.user.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật thông tin này" });
        }

        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa user
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(200).json({ message: "Đã xóa user thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Đổi mật khẩu
 */
router.post('/:id/change-password', authMiddleware, async (req, res) => {
    try {
        // Kiểm tra quyền truy cập
        if (req.user.role !== "admin" && req.user.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "Bạn không có quyền đổi mật khẩu cho user này" });
        }

        const { oldPassword, newPassword } = req.body;
        const result = await userService.changePassword(req.params.id, oldPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Thêm User (Chỉ Admin)
 */
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { username, email, password, role, birth, gender, phone, address } = req.body;

        // Kiểm tra username hoặc email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng!' });
        if (existingUsername) return res.status(400).json({ message: 'Username đã tồn tại!' });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10).catch(err => {
            console.error('Lỗi mã hóa mật khẩu:', err);
            return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu!' });
        });

        // Tạo user mới
        const newUser = await User.create({
            username, email, password: hashedPassword, role, birth, gender, phone, address
        });

        res.status(201).json({ message: 'Tạo tài khoản thành công!', user: newUser });
    } catch (error) {
        console.error('Lỗi thêm user:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});

/**
 * 📌 API Cập nhật thông tin User (Chỉ Admin)
 */
router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, birth, gender, phone, address } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại!' });

        await user.update({ username, email, role, birth, gender, phone, address });

        res.status(200).json({ message: 'Cập nhật thành công!', user });
    } catch (error) {
        console.error('Lỗi cập nhật user:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});

/**
 * 📌 API Xóa User (Chỉ Admin)
 */
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại!' });

        await user.destroy();

        res.sendStatus(204); // No Content (Xóa thành công)
    } catch (error) {
        console.error('Lỗi xóa user:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});

module.exports = router;
