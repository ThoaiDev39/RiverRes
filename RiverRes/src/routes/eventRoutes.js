const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const eventService = require("../services/EventService");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả sự kiện
 */
router.get("/", async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy chi tiết 1 sự kiện
 */
router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * 📌 API Tạo sự kiện mới
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newEvent = await eventService.createEvent(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật sự kiện
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa sự kiện
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(200).json({ message: "Đã xóa sự kiện thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy sự kiện theo trạng thái
 */
router.get("/status/:status", async (req, res) => {
    try {
        const events = await eventService.getEventsByStatus(req.params.status);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy sự kiện theo khoảng thời gian
 */
router.get("/date-range", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Validate input dates
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng cung cấp cả startDate và endDate" });
        }

        // Convert string dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate date format
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Định dạng ngày không hợp lệ" });
        }

        // Validate date range
        if (start > end) {
            return res.status(400).json({ message: "startDate phải nhỏ hơn hoặc bằng endDate" });
        }

        const events = await eventService.getEventsByDateRange(start, end);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Kiểm tra sảnh có sẵn cho sự kiện
 */
router.post("/check-hall-availability", async (req, res) => {
    try {
        const { hallId, startTime, endTime } = req.body;
        const isAvailable = await eventService.checkHallAvailability(
            hallId,
            startTime,
            endTime
        );
        res.status(200).json({ isAvailable });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
