const express = require("express");
const { Menu, Dish } = require("../models");
const router = express.Router();

// Lấy danh sách menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.findAll({ include: Dish });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo menu mới
router.post("/", async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật menu
router.put("/:id", async (req, res) => {
  try {
    await Menu.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Menu updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa menu
router.delete("/:id", async (req, res) => {
  try {
    await Menu.destroy({ where: { id: req.params.id } });
    res.json({ message: "Menu deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
