const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const dishService = require("../services/DishService");
const ImageService = require("../services/ImageService");
const upload = require("../middleware/upload.middleware");
const path = require('path');
const fs = require('fs');

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

/**
 * 📌 API Lấy danh sách ảnh của món ăn
 * 🔓 Không yêu cầu xác thực
 */
router.get("/:id/images", async (req, res) => {
    try {
        const images = await ImageService.getImages('dishes', req.params.id);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * 📌 API Upload ảnh cho món ăn
 * 🔒 Yêu cầu xác thực và quyền admin
 */
router.post("/:id/images", authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
        }
        const image = await ImageService.saveImage(req.file, 'dishes', req.params.id);
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Xóa ảnh của món ăn
 * 🔒 Yêu cầu xác thực và quyền admin
 */
router.delete("/:id/images/:imageId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await ImageService.deleteImage(req.params.imageId);
        res.status(200).json({ message: "Xóa ảnh thành công" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Đặt ảnh làm ảnh chính của món ăn
 * 🔒 Yêu cầu xác thực và quyền admin
 */
router.put("/:id/images/:imageId/set-primary", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const image = await ImageService.setPrimaryImage(req.params.imageId, 'dishes', req.params.id);
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * 📌 API Lấy file ảnh theo tên
 * 🔓 Không yêu cầu xác thực
 */
router.get('/:id/images/:fileName', async (req, res) => {
    const { id, fileName } = req.params;
    const entityType = 'dishes';

    // Xác định đường dẫn đến file ảnh
    const filePath = path.join(__dirname, `../publics/uploads/${entityType}/${fileName}`);

    // Kiểm tra xem file có tồn tại không
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'File không tồn tại' });
        }

        // Trả về file ảnh
        res.sendFile(filePath);
    });
});

module.exports = router;

