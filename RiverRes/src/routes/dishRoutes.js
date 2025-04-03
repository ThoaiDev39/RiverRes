const express = require("express");
const Dish = require("../models/dish");
const Menu = require("../models/menu");
const MenuDish = require("../models/menudish");

const router = express.Router();

/**
 * 📌 API Lấy danh sách món ăn (có thể kèm menu)
 */
router.get("/", async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            include: {
                model: Menu,
                through: { attributes: [] }, // Ẩn bảng trung gian
            },
        });
        res.status(200).json(dishes);
    } catch (error) {
        console.error("Lỗi lấy danh sách món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Lấy chi tiết 1 món ăn
 */
router.get("/:id", async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id, {
            include: {
                model: Menu,
                through: { attributes: ["quantity"] },
            },
        });

        if (!dish) {
            return res.status(404).json({ message: "Món ăn không tồn tại!" });
        }

        res.status(200).json(dish);
    } catch (error) {
        console.error("Lỗi lấy món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Tạo món ăn mới
 */
router.post("/", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const newDish = await Dish.create({ name, description, price, image });
        res.status(201).json(newDish);
    } catch (error) {
        console.error("Lỗi tạo món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
/**
 * 📌 API Tạo nhiều món ăn cùng lúc
 */
router.post("/batch", async (req, res) => {
    try {
        const dishes = req.body; // Mảng các món ăn
        if (!Array.isArray(dishes)) {
            return res.status(400).json({ message: "Dữ liệu phải là một mảng món ăn!" });
        }

        const createdDishes = await Dish.bulkCreate(dishes);
        res.status(201).json({
            message: "Tạo danh sách món ăn thành công!",
            dishes: createdDishes
        });
    } catch (error) {
        console.error("Lỗi tạo danh sách món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Cập nhật món ăn
 */
router.put("/:id", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const dish = await Dish.findByPk(req.params.id);
        
        if (!dish) {
            return res.status(404).json({ message: "Món ăn không tồn tại!" });
        }

        await dish.update({ name, description, price, image });
        res.status(200).json({ message: "Cập nhật món ăn thành công!", dish });
    } catch (error) {
        console.error("Lỗi cập nhật món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Xóa món ăn (cũng xóa khỏi menu)
 */
router.delete("/:id", async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        if (!dish) {
            return res.status(404).json({ message: "Món ăn không tồn tại!" });
        }

        await dish.destroy();
        res.status(200).json({ message: "Đã xóa món ăn thành công!" });
    } catch (error) {
        console.error("Lỗi xóa món ăn:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

module.exports = router;

