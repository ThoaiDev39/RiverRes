const express = require("express");
const Dish = require("../models/dish");
const Menu = require("../models/menu");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả món ăn, kèm thông tin menu
 */
router.get("/", async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            include: { model: Menu, attributes: ["id", "name"] },
        });
        res.status(200).json(dishes);
    } catch (error) {
        console.error("Lỗi lấy danh sách món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Lấy chi tiết một món ăn theo ID, kèm thông tin menu
 */
router.get("/:id", async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id, {
            include: { model: Menu, attributes: ["id", "name"] },
        });

        if (!dish) return res.status(404).json({ message: "Món ăn không tồn tại!" });

        res.status(200).json(dish);
    } catch (error) {
        console.error("Lỗi lấy món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Thêm món ăn vào menu (Chỉ Admin)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, image, menuId } = req.body;

        // Kiểm tra dữ liệu hợp lệ
        if (!name || !price || !menuId) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "Giá món ăn phải là số lớn hơn 0!" });
        }

        // Kiểm tra menu có tồn tại không
        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        const newDish = await Dish.create({ name, description, price, image, menuId });

        res.status(201).json({ message: "Thêm món ăn thành công!", dish: newDish });
    } catch (error) {
        console.error("Lỗi thêm món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Cập nhật thông tin món ăn (Chỉ Admin)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, menuId } = req.body;

        const dish = await Dish.findByPk(id);
        if (!dish) return res.status(404).json({ message: "Món ăn không tồn tại!" });

        // Kiểm tra menu nếu có cập nhật
        if (menuId) {
            const menu = await Menu.findByPk(menuId);
            if (!menu) return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        await dish.update({
            name: name || dish.name,
            description: description || dish.description,
            price: isNaN(price) ? dish.price : price,
            image: image || dish.image,
            menuId: menuId || dish.menuId,
        });

        res.status(200).json({ message: "Cập nhật món ăn thành công!", dish });
    } catch (error) {
        console.error("Lỗi cập nhật món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Xóa món ăn (Chỉ Admin)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        if (!dish) return res.status(404).json({ message: "Món ăn không tồn tại!" });

        await dish.destroy();
        res.status(200).json({ message: "Xóa món ăn thành công!" });
    } catch (error) {
        console.error("Lỗi xóa món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

module.exports = router;
