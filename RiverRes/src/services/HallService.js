const { Op } = require("sequelize");
const BaseService = require("./BaseService");
const Hall = require("../models/hall");
const TimeSlot = require("../models/timeSlot");
const Event = require("../models/event");

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

    // Kiểm tra sảnh còn trống các time slot nào vào một ngày cụ thể
    async getAvailableTimeSlots(hallId, date) {
        // Kiểm tra sảnh có tồn tại không
        const hall = await this.getHallById(hallId);
        if (!hall) {
            throw new Error('Sảnh không tồn tại');
        }

        // Lấy tất cả các time slot
        const allTimeSlots = await TimeSlot.findAll();

        // Lấy các sự kiện đã đặt cho sảnh vào ngày đó
        const bookedEvents = await Event.findAll({
            where: {
                hallId,
                eventDate: date,
                status: {
                    [Op.notIn]: ['cancelled'] // Không tính các sự kiện đã hủy
                }
            },
            attributes: ['timeSlotId']
        });

        // Lấy danh sách các timeSlotId đã đặt
        const bookedTimeSlotIds = bookedEvents.map(event => event.timeSlotId);

        // Lọc ra các time slot còn trống
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedTimeSlotIds.includes(slot.id));

        return {
            hallId,
            date,
            availableTimeSlots
        };
    }
}

module.exports = new HallService();