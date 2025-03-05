const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Menu = require("../models/menu");

const router = express.Router();

/**
 * 📌 Lấy danh sách tất cả Menu
 */
router.get("/menus", async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.status(200).json({ menus });
    } catch (error) {
        console.error("Lỗi lấy danh sách menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 Lấy chi tiết một Menu theo ID
 */
router.get("/menus/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        res.status(200).json({ menu });
    } catch (error) {
        console.error("Lỗi lấy menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 Thêm Menu (Chỉ Admin)
 */
router.post("/menus", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tên menu không được để trống!" });
        }

        const newMenu = await Menu.create({ name, description });

        res.status(201).json({ message: "Tạo menu thành công!", menu: newMenu });
    } catch (error) {
        console.error("Lỗi thêm menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 Cập nhật thông tin Menu (Chỉ Admin)
 */
router.put("/menus/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        await menu.update({ name, description });

        res.status(200).json({ message: "Cập nhật menu thành công!", menu });
    } catch (error) {
        console.error("Lỗi cập nhật menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 Xóa Menu (Chỉ Admin)
 */
router.delete("/menus/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await Menu.findByPk(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        await menu.destroy();

        res.status(200).json({ message: "Xóa menu thành công!" });
    } catch (error) {
        console.error("Lỗi xóa menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

module.exports = router;
