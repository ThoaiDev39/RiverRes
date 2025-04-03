const express = require("express");
const { Event, Hall, Menu, User } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 📌 Lấy danh sách sự kiện (Admin mới xem được)
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const events = await Event.findAll({ include: [User, Hall, Menu] });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📌 Tạo sự kiện mới (Chỉ user đã đăng nhập)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId, eventDate, startTime, endTime, hallId, menuId, numberOfTables,numberOfGuests, totalPrice} = req.body;

    // Kiểm tra userId có khớp với user đang đăng nhập không
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền đặt sự kiện cho người khác" });
    }

    // Kiểm tra User, Hall, Menu có tồn tại không
    const user = await User.findByPk(userId);
    const hall = await Hall.findByPk(hallId);
    const menu = await Menu.findByPk(menuId);

    if (!user || !hall || !menu) {
      return res.status(404).json({ error: "User, Hall hoặc Menu không tồn tại" });
    }

    // Kiểm tra số lượng khách hợp lệ
    if (!numberOfGuests || numberOfGuests <= 0) {
      return res.status(400).json({ error: "Số khách phải lớn hơn 0" });
    }

    // Kiểm tra thời gian hợp lệ
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Thời gian bắt đầu phải trước thời gian kết thúc" });
    }

    // Tính tổng tiền: giá sảnh + (giá menu * số khách)
    //const totalPrice = hall.price + menu.price * numberOfGuests;
    //console.log(hall.price, menu.price);
    

    // Tạo sự kiện
    const event = await Event.create({
      userId,
      eventDate,
      startTime,
      endTime,
      hallId,
      menuId,
      numberOfTables, 
      numberOfGuests,
      totalPrice,
      status: "pending", // Mặc định trạng thái là "pending"
    });

    res.status(201).json({ message: "Tạo sự kiện thành công!", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * 📌 Cập nhật trạng thái sự kiện (Chỉ Admin)
 */
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Sự kiện không tồn tại" });

    await event.update({ status });
    res.json({ message: "Cập nhật trạng thái sự kiện thành công", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * 📌 Xóa sự kiện (Chỉ Admin)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Sự kiện không tồn tại" });

    await event.destroy();
    res.json({ message: "Xóa sự kiện thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
