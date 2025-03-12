const Booking = require("../models/event");

const checkBookingExists = async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findByPk(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  req.booking = booking; // Lưu booking để dùng trong request
  next();
};

module.exports = checkBookingExists;
