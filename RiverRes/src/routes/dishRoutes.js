const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const dishService = require("../services/DishService");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả món ăn
 */
router.get("/", async (req, res) => {
    try {
        const dishes = await dishService.getAllDishes();
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy chi tiết 1 món ăn
 */
router.get("/:id", async (req, res) => {
    try {
        const dish = await dishService.getDishById(req.params.id);
        res.status(200).json(dish);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * 📌 API Tạo món ăn mới
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newDish = await dishService.createDish(req.body);
        res.status(201).json(newDish);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật món ăn
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const dish = await dishService.updateDish(req.params.id, req.body);
        res.status(200).json(dish);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa món ăn
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await dishService.deleteDish(req.params.id);
        res.status(200).json({ message: "Đã xóa món ăn thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Tìm kiếm món ăn
 */
router.get("/search/:query", async (req, res) => {
    try {
        const dishes = await dishService.searchDishes(req.params.query);
        res.status(200).json(dishes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy món ăn theo danh mục
 */
router.get("/category/:category", async (req, res) => {
    try {
        const dishes = await dishService.getDishesByCategory(req.params.category);
        res.status(200).json(dishes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

