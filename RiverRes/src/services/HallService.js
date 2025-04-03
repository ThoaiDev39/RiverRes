const { Op } = require("sequelize");
const BaseService = require("./BaseService");
const Hall = require("../models/hall");

class HallService extends BaseService {
    constructor() {
        super(Hall);
    }

    // Validation rules cho hall
    hallRules = {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 500 },
        capacity: { required: true },
        price: { required: true }
    };

    // Lấy tất cả sảnh
    async getAllHalls() {
        return await this.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    // Lấy sảnh theo ID
    async getHallById(id) {
        const hall = await this.findById(id);
        if (!hall) {
            throw new Error('Sảnh không tồn tại');
        }
        return hall;
    }

    // Tạo sảnh mới
    async createHall(hallData) {
        // Validate dữ liệu
        this.validate(hallData, this.hallRules);
        
        // Tạo sảnh mới
        const newHall = await this.create(hallData);
        return newHall;
    }

    // Cập nhật sảnh
    async updateHall(id, hallData) {
        // Validate dữ liệu
        this.validate(hallData, this.hallRules);

        // Cập nhật sảnh
        return await this.update(id, hallData);
    }

    // Xóa sảnh
    async deleteHall(id) {
        return await this.delete(id);
    }

    // Lấy sảnh theo sức chứa
    async getHallsByCapacity(minCapacity) {
        return await this.findAll({
            where: {
                capacity: {
                    [Op.gte]: minCapacity
                }
            }
        });
    }

    // Kiểm tra sảnh có sẵn trong khoảng thời gian
    async checkHallAvailability(hallId, startTime, endTime) {
        const hall = await this.getHallById(hallId);
        // TODO: Implement availability check logic
        return true;
    }
}

module.exports = new HallService();