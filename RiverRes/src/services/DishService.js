const { Op } = require("sequelize");
const BaseService = require('./BaseService');
const Dish = require('../models/dish');

class DishService extends BaseService {
    constructor() {
        super(Dish);
    }

    // Validation rules cho dish
    dishRules = {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 500 },
        price: { required: true },
        category: { required: true },
        image: { required: true }
    };

    // Lấy tất cả món ăn
    async getAllDishes() {
        return await this.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    // Lấy món ăn theo ID
    async getDishById(id) {
        const dish = await this.findById(id);
        if (!dish) {
            throw new Error('Món ăn không tồn tại');
        }
        return dish;
    }

    // Tạo món ăn mới
    async createDish(dishData) {
        // Validate dữ liệu
        this.validate(dishData, this.dishRules);
        
        // Tạo món ăn mới
        const newDish = await this.create(dishData);
        return newDish;
    }

    // Cập nhật món ăn
    async updateDish(id, dishData) {
        // Validate dữ liệu
        this.validate(dishData, this.dishRules);

        // Cập nhật món ăn
        return await this.update(id, dishData);
    }

    // Xóa món ăn
    async deleteDish(id) {
        return await this.delete(id);
    }

    // Tìm kiếm món ăn theo tên hoặc mô tả
    async searchDishes(query) {
        return await this.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ]
            }
        });
    }

    // Lấy món ăn theo danh mục
    async getDishesByCategory(category) {
        return await this.findAll({
            where: { category }
        });
    }
}

module.exports = new DishService(); 