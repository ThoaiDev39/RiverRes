const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const hallService = require("../services/HallService");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả sảnh
 * 🔓 Không yêu cầu xác thực - cho phép người dùng chưa đăng nhập cũng có thể xem
 */
router.get("/", async (req, res) => {
    try {
        const halls = await hallService.getAllHalls();
        res.status(200).json(halls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy chi tiết 1 sảnh
 */
router.get("/:id", async (req, res) => {
    try {
        const hall = await hallService.getHallById(req.params.id);
        res.status(200).json(hall);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * 📌 API Tạo sảnh mới
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newHall = await hallService.createHall(req.body);
        res.status(201).json(newHall);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật sảnh
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const hall = await hallService.updateHall(req.params.id, req.body);
        res.status(200).json(hall);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa sảnh
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await hallService.deleteHall(req.params.id);
        res.status(200).json({ message: "Đã xóa sảnh thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy sảnh theo sức chứa
 */
router.get("/capacity/:minCapacity", async (req, res) => {
    try {
        const halls = await hallService.getHallsByCapacity(req.params.minCapacity);
        res.status(200).json(halls);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Kiểm tra sảnh có sẵn
 */
router.post("/:id/check-availability", async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const isAvailable = await hallService.checkHallAvailability(
            req.params.id,
            startTime,
            endTime
        );
        res.status(200).json({ isAvailable });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Kiểm tra sảnh còn trống các time slot nào vào một ngày cụ thể
 * 🔓 Không yêu cầu xác thực
 */
router.get("/:id/available-time-slots", async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: "Vui lòng cung cấp ngày cần kiểm tra" });
        }
        
        const result = await hallService.getAvailableTimeSlots(req.params.id, date);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
