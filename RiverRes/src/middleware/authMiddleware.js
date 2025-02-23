const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Không có token, truy cập bị từ chối!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = await User.findByPk(decoded.userId);

        if (!req.user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại!' });
        }

        next();
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        res.status(401).json({ message: 'Token không hợp lệ!' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
