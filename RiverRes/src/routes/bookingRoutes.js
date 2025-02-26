const express = require("express");
const { Booking, Hall, Menu, User } = require("../models");
const router = express.Router();

// 🟢 Lấy danh sách đơn đặt tiệc (bao gồm User, Hall, Menu)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Hall, Menu], // Join với bảng User, Hall, Menu
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Tạo đơn đặt tiệc mới
router.post("/", async (req, res) => {
  try {
    const { userId, eventDate, startTime, endTime, hallId, menuId, numberOfGuests } = req.body;

    // Kiểm tra User, Hall và Menu có tồn tại không
    const user = await User.findByPk(userId);
    const hall = await Hall.findByPk(hallId);
    const menu = await Menu.findByPk(menuId);

    if (!user || !hall || !menu) {
      return res.status(404).json({ error: "User, Hall or Menu not found" });
    }

    // Tính tổng tiền: giá sảnh + (giá menu * số khách)
    const totalPrice = hall.price + menu.price * numberOfGuests;

    const booking = await Booking.create({
      userId,
      eventDate,
      startTime,
      endTime,
      hallId,
      menuId,
      numberOfGuests,
      totalPrice,
    });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Cập nhật trạng thái đơn đặt tiệc
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await Booking.update({ status }, { where: { id: req.params.id } });
    res.json({ message: "Booking status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Xóa đơn đặt tiệc
router.delete("/:id", async (req, res) => {
  try {
    await Booking.destroy({ where: { id: req.params.id } });
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
