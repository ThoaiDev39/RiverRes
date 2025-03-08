const express = require('express');
const bcrypt = require('bcryptjs');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/Users');

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả khách hàng (Chỉ Admin)
 * 🔐 Yêu cầu xác thực & quyền Admin
 */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'role', 'email', 'username', 'birth', 'gender', 'phone', 'address']
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi lấy danh sách khách hàng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});
// Hoàng Hà edit and add
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'role', 'email', 'username', 'birth', 'gender', 'phone', 'address']
        });

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Lỗi lấy thông tin cá nhân:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});
// user tự cập nhật thông tin cá nhân
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const { username, email, birth, gender, phone, address } = req.body;

        //const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại!' });

        await user.update({ username, email, birth, gender, phone, address });

        res.status(200).json({ message: 'Cập nhật thành công!', user });
    } catch (error) {
        console.error('Lỗi cập nhật user:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
    }
});
/**
 * 📌 API Lấy thông tin user theo ID (Chỉ Admin)
 * 🔐 Yêu cầu xác thực & quyền Admin
 */
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm user theo ID
        const user = await User.findByPk(id, {
            attributes: ['id', 'role', 'email', 'username', 'birth', 'gender', 'phone', 'address']
        });

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Lỗi lấy user theo ID:', error);
        res.status(500).json({ message: 'Lỗi máy chủ!' });
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
