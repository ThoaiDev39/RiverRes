const express = require("express");
const { Dish } = require("../models");
const router = express.Router();

// Lấy danh sách món ăn
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.findAll();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo món ăn mới
router.post("/", async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cập nhật món ăn
router.put("/:id", async (req, res) => {
  try {
    await Dish.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Dish updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xóa món ăn
router.delete("/:id", async (req, res) => {
  try {
    await Dish.destroy({ where: { id: req.params.id } });
    res.json({ message: "Dish deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
