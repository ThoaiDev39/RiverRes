const express = require("express");
const { Hall } = require("../models");
const router = express.Router();

// 🟢 Lấy danh sách sảnh tiệc
router.get("/", async (req, res) => {
  try {
    const halls = await Hall.findAll();
    res.json(halls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Thêm sảnh mới
router.post("/", async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    res.json(hall);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Cập nhật thông tin sảnh
router.put("/:id", async (req, res) => {
  try {
    await Hall.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Hall updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟢 Xóa sảnh tiệc
router.delete("/:id", async (req, res) => {
  try {
    await Hall.destroy({ where: { id: req.params.id } });
    res.json({ message: "Hall deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
