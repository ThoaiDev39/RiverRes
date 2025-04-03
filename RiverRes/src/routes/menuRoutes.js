const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const menuService = require("../services/MenuService");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả Menu kèm danh sách món ăn
 */
router.get("/", async (req, res) => {
    try {
        const menus = await menuService.getAllMenusWithDishes();
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy chi tiết 1 menu
 */
router.get("/:id", async (req, res) => {
    try {
        const menu = await menuService.getMenuById(req.params.id);
        res.status(200).json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * 📌 API Tạo menu mới
 */
router.post("/", adminMiddleware, async (req, res) => {
    try {
        const newMenu = await menuService.createMenu(req.body);
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Thêm món ăn vào menu
 */
router.post("/:id/add-dish", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { dishId, quantity } = req.body;
        const menu = await menuService.addDishToMenu(req.params.id, dishId, quantity);
        res.status(200).json(menu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Tạo menu đầy đủ với danh sách món
 */
router.post("/createfullmenu", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const menu = await menuService.createFullMenu(req.body);
        res.status(201).json(menu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Cập nhật menu
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const menu = await menuService.updateMenu(req.params.id, req.body);
        res.status(200).json(menu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa menu
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await menuService.deleteMenu(req.params.id);
        res.status(200).json({ message: "Đã xóa menu thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
