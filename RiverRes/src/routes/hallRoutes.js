const express = require("express");
const Hall = require("../models/hall");
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả sảnh tiệc
 */
router.get("/", async (req, res) => {
    try {
        const halls = await Hall.findAll();
        res.status(200).json(halls);
    } catch (error) {
        console.error("Lỗi lấy danh sách sảnh:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Lấy thông tin sảnh theo ID
 */
router.get("/:id", async (req, res) => {
    try {
        const hall = await Hall.findByPk(req.params.id);
        if (!hall) return res.status(404).json({ message: "Sảnh không tồn tại!" });

        res.status(200).json(hall);
    } catch (error) {
        console.error("Lỗi lấy sảnh theo ID:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Thêm sảnh mới (Chỉ Admin)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, capacity, price, image, description } = req.body;

        // Kiểm tra dữ liệu hợp lệ
        if (!name || !capacity || !price) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }
        if (isNaN(capacity) || isNaN(price) || capacity <= 0 || price <= 0) {
            return res.status(400).json({ message: "Capacity và price phải là số lớn hơn 0!" });
        }

        const newHall = await Hall.create({ name, capacity, price, image, description });

        res.status(201).json({ message: "Thêm sảnh thành công!", hall: newHall });
    } catch (error) {
        console.error("Lỗi thêm sảnh:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Cập nhật thông tin sảnh (Chỉ Admin)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity, price, image, description } = req.body;

        const hall = await Hall.findByPk(id);
        if (!hall) return res.status(404).json({ message: "Sảnh không tồn tại!" });

        await hall.update({
            name: name || hall.name,
            capacity: isNaN(capacity) ? hall.capacity : capacity,
            price: isNaN(price) ? hall.price : price,
            image: image || hall.image,
            description: description || hall.description,
        });

        res.status(200).json({ message: "Cập nhật sảnh thành công!", hall });
    } catch (error) {
        console.error("Lỗi cập nhật sảnh:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Xóa sảnh (Chỉ Admin)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const hall = await Hall.findByPk(req.params.id);
        if (!hall) return res.status(404).json({ message: "Sảnh không tồn tại!" });

        await hall.destroy();
        res.status(200).json({ message: "Xóa sảnh thành công!" });
    } catch (error) {
        console.error("Lỗi xóa sảnh:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

module.exports = router;
