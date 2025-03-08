const express = require("express");
const { Op } = require("sequelize");
const { Booking, Hall, Menu, User } = require("../models");
const checkBookingExists = require("../middleware/checkBookingExists");

const router = express.Router();

/**
 * @route   GET /bookings
 * @desc    Lấy danh sách tất cả đơn đặt tiệc
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Hall, Menu], // Kết hợp dữ liệu từ User, Hall, Menu
      order: [["eventDate", "ASC"]],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /bookings
 * @desc    Tạo đơn đặt tiệc mới
 */
router.post("/", async (req, res) => {
  try {
    const { userId, eventDate, startTime, endTime, hallId, menuId, numberOfGuests } = req.body;

    // Kiểm tra User, Hall và Menu tồn tại
    const user = await User.findByPk(userId);
    const hall = await Hall.findByPk(hallId);
    const menu = await Menu.findByPk(menuId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!hall) return res.status(404).json({ error: "Hall not found" });
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    // Kiểm tra sảnh có bị đặt trùng giờ không
    const conflict = await Booking.findOne({
      where: {
        hallId,
        eventDate,
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
        ],
      },
    });

    if (conflict) {
      return res.status(400).json({ error: "Hall is already booked for this time slot" });
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

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   GET /bookings/:id
 * @desc    Lấy chi tiết đơn đặt tiệc
 */
router.get("/:id", checkBookingExists, async (req, res) => {
  res.json(req.booking);
});

/**
 * @route   PUT /bookings/:id
 * @desc    Cập nhật đơn đặt tiệc
 */
router.put("/:id", checkBookingExists, async (req, res) => {
  try {
    const { eventDate, startTime, endTime, numberOfGuests, totalPrice, status } = req.body;
    const { booking } = req;

    // Kiểm tra trạng thái hợp lệ
    if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Kiểm tra trùng lịch nếu thay đổi ngày/giờ
    if (eventDate || startTime || endTime) {
      const conflict = await Booking.findOne({
        where: {
          hallId: booking.hallId,
          eventDate: eventDate || booking.eventDate,
          id: { [Op.ne]: booking.id },
          [Op.or]: [
            { startTime: { [Op.between]: [startTime || booking.startTime, endTime || booking.endTime] } },
            { endTime: { [Op.between]: [startTime || booking.startTime, endTime || booking.endTime] } },
          ],
        },
      });

      if (conflict) {
        return res.status(400).json({ error: "Hall is already booked for this time slot" });
      }
    }

    // Cập nhật thông tin booking
    await booking.update({ eventDate, startTime, endTime, numberOfGuests, totalPrice, status });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   DELETE /bookings/:id
 * @desc    Xóa đơn đặt tiệc
 */
router.delete("/:id", checkBookingExists, async (req, res) => {
  try {
    await req.booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
