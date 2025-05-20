const BaseService = require('./BaseService');
const Menu = require('../models/menu');
const Dish = require('../models/dish');
const MenuDish = require('../models/menudish');

class MenuService extends BaseService {
    constructor() {
        super(Menu);
    }

    // Validation rules cho menu
    menuRules = {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 500 }
    };

    // Lấy tất cả menu kèm danh sách món ăn
    async getAllMenusWithDishes() {
        return await this.findAll({
            include: {
                model: Dish,
                through: { attributes: ["quantity"] }
            }
        });
    }

    // Lấy chi tiết menu theo ID
    async getMenuById(id) {
        const menu = await this.findById(id, {
            include: {
                model: Dish,
                through: { attributes: ["quantity"] }
            }
        });
        if (!menu) {
            throw new Error('Menu không tồn tại');
        }
        return menu;
    }

    // Tạo menu mới
    async createMenu(menuData) {
        // Validate dữ liệu
        this.validate(menuData, this.menuRules);
        
        // Tạo menu mới
        const newMenu = await this.create(menuData);
        return newMenu;
    }

    // Tạo menu đầy đủ với danh sách món
    async createFullMenu(menuData) {
        const { name, description, dishes } = menuData;
        
        // Validate dữ liệu menu
        this.validate({ name, description }, this.menuRules);
        
        // Validate danh sách món
        if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
            throw new Error('Danh sách món không hợp lệ');
        }

        // Tạo menu mới
        const newMenu = await this.create({ name, description });

        // Thêm các món vào menu
        const menuDishes = dishes.map(dish => ({
            menuId: newMenu.id,
            dishId: dish.dishId,
            quantity: dish.quantity || 1
        }));

        await MenuDish.bulkCreate(menuDishes);

        // Trả về menu kèm danh sách món
        return await this.getMenuById(newMenu.id);
    }

    // Cập nhật menu
    async updateMenu(id, menuData) {
        const { name, description, dishes } = menuData;
        
        // Validate dữ liệu menu
        this.validate({ name, description }, this.menuRules);

        // Cập nhật thông tin menu
        await this.update(id, { name, description });

        // Nếu có danh sách món mới
        if (dishes && dishes.length > 0) {
            // Xóa các món cũ
            await MenuDish.destroy({ where: { menuId: id } });

            // Thêm các món mới
            const menuDishes = dishes.map(dish => ({
                menuId: id,
                dishId: dish.id,
                quantity: dish.quantity || 1
            }));

            await MenuDish.bulkCreate(menuDishes);
        }

        // Trả về menu đã cập nhật
        return await this.getMenuById(id);
    }

    // Xóa menu
    async deleteMenu(id) {
        // Xóa các món trong menu trước
        await MenuDish.destroy({ where: { menuId: id } });
        
        // Xóa menu
        return await this.delete(id);
    }

    // Thêm món vào menu
    async addDishToMenu(menuId, dishId, quantity) {
        // Kiểm tra menu và dish tồn tại
        const menu = await this.findById(menuId);
        const dish = await Dish.findByPk(dishId);

        if (!menu || !dish) {
            throw new Error('Menu hoặc món ăn không tồn tại');
        }

        // Thêm hoặc cập nhật món trong menu
        await MenuDish.upsert({
            menuId,
            dishId,
            quantity: quantity || 1
        });

        return await this.getMenuById(menuId);
    }
}

module.exports = new MenuService(); 