const { Op } = require("sequelize");
const BaseService = require('./BaseService');
const Event = require('../models/event');
const Hall = require('../models/hall');

class EventService extends BaseService {
    constructor() {
        super(Event);
    }

    // Validation rules cho event
    eventRules = {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 500 },
        startTime: { required: true },
        endTime: { required: true },
        hallId: { required: true },
        status: { required: true },
        price: { required: true }
    };

    // Lấy tất cả sự kiện
    async getAllEvents() {
        return await this.findAll({
            include: [{
                model: Hall,
                attributes: ['name', 'capacity']
            }],
            order: [['startTime', 'DESC']]
        });
    }

    // Lấy sự kiện theo ID
    async getEventById(id) {
        const event = await this.findById(id, {
            include: [{
                model: Hall,
                attributes: ['name', 'capacity']
            }]
        });
        if (!event) {
            throw new Error('Sự kiện không tồn tại');
        }
        return event;
    }

    // Tạo sự kiện mới
    async createEvent(eventData) {
        // Validate dữ liệu
        this.validate(eventData, this.eventRules);

        // Kiểm tra sảnh có tồn tại không
        const hall = await Hall.findByPk(eventData.hallId);
        if (!hall) {
            throw new Error('Sảnh không tồn tại');
        }

        // Kiểm tra sảnh có sẵn trong thời gian này không
        const isAvailable = await this.checkHallAvailability(
            eventData.hallId,
            eventData.startTime,
            eventData.endTime
        );
        if (!isAvailable) {
            throw new Error('Sảnh đã được đặt trong thời gian này');
        }
        
        // Tạo sự kiện mới
        const newEvent = await this.create(eventData);
        return await this.getEventById(newEvent.id);
    }

    // Cập nhật sự kiện
    async updateEvent(id, eventData) {
        // Validate dữ liệu
        this.validate(eventData, this.eventRules);

        // Kiểm tra sảnh có tồn tại không
        if (eventData.hallId) {
            const hall = await Hall.findByPk(eventData.hallId);
            if (!hall) {
                throw new Error('Sảnh không tồn tại');
            }
        }

        // Cập nhật sự kiện
        return await this.update(id, eventData);
    }

    // Xóa sự kiện
    async deleteEvent(id) {
        return await this.delete(id);
    }

    // Lấy sự kiện theo trạng thái
    async getEventsByStatus(status) {
        return await this.findAll({
            where: { status },
            include: [{
                model: Hall,
                attributes: ['name', 'capacity']
            }]
        });
    }

    // Lấy sự kiện theo khoảng thời gian
    async getEventsByDateRange(startDate, endDate) {
        // Chuyển đổi ngày tháng thành timestamp
        // const startDateTime = new Date(startDate);
        // startDateTime.setHours(0, 0, 0, 0); // Set về 00:00:00

        // const endDateTime = new Date(endDate);
        // endDateTime.setHours(23, 59, 59, 999); // Set về 23:59:59

        return await this.findAll({
            where: {
                eventDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: Hall,
                attributes: ['name', 'capacity']
            }],
            order: [['eventDate', 'ASC']] // Sắp xếp theo ngày tăng dần
        });
    }

    // Kiểm tra sảnh có sẵn trong khoảng thời gian
    async checkHallAvailability(hallId, startTime, endTime) {
        // Kiểm tra sảnh có tồn tại không
        const hall = await Hall.findByPk(hallId);
        if (!hall) {
            throw new Error('Sảnh không tồn tại');
        }

        // Tìm các sự kiện đã đặt sảnh trong khoảng thời gian này
        const conflictingEvents = await this.findAll({
            where: {
                hallId,
                status: 'active', // Chỉ kiểm tra các sự kiện đang active
                [Op.or]: [
                    // Trường hợp 1: Sự kiện mới nằm hoàn toàn trong một sự kiện đã có
                    {
                        startTime: { [Op.lte]: startTime },
                        endTime: { [Op.gte]: endTime }
                    },
                    // Trường hợp 2: Sự kiện mới bắt đầu trong khoảng thời gian của sự kiện đã có
                    {
                        startTime: { [Op.lte]: startTime },
                        endTime: { [Op.gt]: startTime }
                    },
                    // Trường hợp 3: Sự kiện mới kết thúc trong khoảng thời gian của sự kiện đã có
                    {
                        startTime: { [Op.lt]: endTime },
                        endTime: { [Op.gte]: endTime }
                    },
                    // Trường hợp 4: Sự kiện mới bao trùm hoàn toàn một sự kiện đã có
                    {
                        startTime: { [Op.gte]: startTime },
                        endTime: { [Op.lte]: endTime }
                    }
                ]
            }
        });

        // Nếu không có sự kiện nào xung đột, sảnh có sẵn
        return conflictingEvents.length === 0;
    }
}

module.exports = new EventService();