const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const MenuDish = require("../models/menudish");

const router = express.Router();

/**
 * 📌 API Lấy danh sách tất cả Menu kèm danh sách món ăn
 */
router.get("/", async (req, res) => {
    try {
        const menus = await Menu.findAll({
            include: {
                model: Dish,
                through: { attributes: ["quantity"] }, // Lấy số lượng từ bảng trung gian
            },
        });
        res.status(200).json(menus);
    } catch (error) {
        console.error("Lỗi lấy danh sách menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Lấy chi tiết 1 menu
 */
router.get("/:id", async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id, {
            include: {
                model: Dish,
                through: { attributes: ["quantity"] },
            },
        });

        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        res.status(200).json(menu);
    } catch (error) {
        console.error("Lỗi lấy menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Tạo menu mới
 */
router.post("/", adminMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newMenu = await Menu.create({ name, description });
        res.status(201).json(newMenu);
    } catch (error) {
        console.error("Lỗi tạo menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

/**
 * 📌 API Thêm món ăn vào menu
 */
router.post("/:id/add-dish", authMiddleware, adminMiddleware,  async (req, res) => {
    try {
        const { dishId, quantity } = req.body;
        const menuId = req.params.id;

        // Kiểm tra xem menu và dish có tồn tại không
        const menu = await Menu.findByPk(menuId);
        const dish = await Dish.findByPk(dishId);

        if (!menu || !dish) {
            return res.status(404).json({ message: "Menu hoặc món ăn không tồn tại!" });
        }

        // Thêm món vào menu (nếu đã có thì cập nhật quantity)
        await MenuDish.upsert({ menuId, dishId, quantity });

        res.status(200).json({ message: "Đã thêm món vào menu thành công!" });
    } catch (error) {
        console.error("Lỗi thêm món vào menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
router.post("/createfullmenu", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, dishes } = req.body; // Dishes: [{ dishId, quantity }]
        
        // Tạo menu mới
        const newMenu = await Menu.create({ name, description });

        // Nếu có danh sách món, thêm vào bảng trung gian
        if (dishes && dishes.length > 0) {
            const menuDishes = dishes.map(dish => ({
                menuId: newMenu.id,
                dishId: dish.dishId,
                quantity: dish.quantity || 1, // Mặc định số lượng là 1 nếu không có
            }));

            await MenuDish.bulkCreate(menuDishes);
        }

        // Trả về menu kèm danh sách món vừa thêm
        const fullMenu = await Menu.findByPk(newMenu.id, {
            include: {
                model: Dish,
                through: { attributes: ["quantity"] },
            },
        });

        res.status(201).json(fullMenu);
    } catch (error) {
        console.error("Lỗi tạo menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, dishes } = req.body;
        const menu = await Menu.findByPk(req.params.id);
        console.log(req.body);
        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        await menu.update({ name, description });
        
        if (dishes && dishes.length > 0) {            
            const menuDishes = dishes.map(dish => ({
                
                menuId: menu.id,
                dishId: dish.id,
                quantity: dish.quantity || 1, // Mặc định số lượng là 1 nếu không có
            }));
            await MenuDish.destroy({ where: { menuId: menu.id } });
            await MenuDish.bulkCreate(menuDishes); // Thêm môn ăn vào bảng trung gian
        }

        const updatedMenu = await Menu.findByPk(req.params.id, {
            include: {
                model: Dish,
                through: { attributes: ["quantity"] },
            },
        });

        res.status(200).json(updatedMenu);
    } catch (error) {
        console.error("Lỗi cập nhật menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const menu = await Menu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menu không tồn tại!" });
        }

        // Xóa tất cả liên kết trong bảng trung gian trước
        await MenuDish.destroy({ where: { menuId: menu.id } });

        // Sau đó xóa menu
        await menu.destroy();

        res.status(200).json({ message: "Đã xóa menu thành công!" , id: menu.id});
    } catch (error) {
        console.error("Lỗi xóa menu:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});



module.exports = router;
