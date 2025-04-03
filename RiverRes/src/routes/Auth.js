const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const authService = require('../services/AuthService');

const router = express.Router();

// 📌 API Đăng ký
router.post('/register', async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 API Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 API Đổi mật khẩu
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.userId, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 API Quên mật khẩu
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 API Đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
