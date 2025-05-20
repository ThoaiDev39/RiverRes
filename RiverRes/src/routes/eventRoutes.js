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
router.get("/:id", authMiddleware, async (req, res) => {
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
router.post("/", authMiddleware, async (req, res) => {
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
        const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
        res.status(200).json(updatedEvent);
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
        
        // Validate input
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc' });
        }

        const events = await eventService.getEventsByDateRange(startDate, endDate);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Kiểm tra sảnh có sẵn cho sự kiện
 */
router.post("/check-hall-availability", async (req, res) => {
    try {
        const { hallId, eventDate, timeSlotId } = req.body;
        
        // Validate input
        if (!hallId || !eventDate || !timeSlotId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: hallId, eventDate, timeSlotId' });
        }

        const isAvailable = await eventService.checkHallAvailability(hallId, eventDate, timeSlotId);
        res.status(200).json({ isAvailable });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật trạng thái sự kiện
 */
router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedEvent = await eventService.updateEventStatus(req.params.id, status);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy sự kiện theo ID người dùng
 */
router.get("/user/:userId",  async (req, res) => {
    try {
        // Kiểm tra quyền truy cập
        // if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.userId)) {
        //     return res.status(403).json({ message: "Bạn không có quyền truy cập thông tin này" });
        // }

        const events = await eventService.getEventsByUserId(req.params.userId);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
