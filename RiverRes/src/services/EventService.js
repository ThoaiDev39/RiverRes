const { Op } = require("sequelize");
const BaseService = require('./BaseService');
const Event = require('../models/event');
const Hall = require('../models/hall');
const TimeSlot = require('../models/timeSlot');

class EventService extends BaseService {
    constructor() {
        super(Event);
    }

    // Validation rules cho event
    eventRules = {
        eventName: { required: true },
        userId: { required: true },
        hallId: { required: true },
        timeSlotId: { required: true },
        menuId: { required: true },
        eventDate: { required: true },
        numberOfTables: { required: true },
        numberOfGuests: { required: true }
    };

    // Lấy tất cả sự kiện
    async getAllEvents() {
        return await this.findAll({
            include: [
                {
                    model: Hall,
                    attributes: ['name', 'capacity']
                },
                {
                    model: TimeSlot,
                    attributes: ['name', 'startTime', 'endTime']
                }
            ],
            order: [['eventDate', 'DESC']]
        });
    }

    // Lấy sự kiện theo ID
    async getEventById(id) {
        const event = await this.findById(id, {
            include: [
                {
                    model: Hall,
                    attributes: ['name', 'capacity']
                },
                {
                    model: TimeSlot,
                    attributes: ['name', 'startTime', 'endTime']
                }
            ]
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

        // Kiểm tra time slot có tồn tại không
        const timeSlot = await TimeSlot.findByPk(eventData.timeSlotId);
        if (!timeSlot) {
            throw new Error('Khung giờ không tồn tại');
        }

        // Kiểm tra sảnh có sẵn trong khung giờ này không
        const isAvailable = await this.checkHallAvailability(
            eventData.hallId,
            eventData.eventDate,
            eventData.timeSlotId
        );
        if (!isAvailable) {
            throw new Error('Sảnh đã được đặt trong khung giờ này');
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

        // Kiểm tra time slot có tồn tại không
        if (eventData.timeSlotId) {
            const timeSlot = await TimeSlot.findByPk(eventData.timeSlotId);
            if (!timeSlot) {
                throw new Error('Khung giờ không tồn tại');
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
            include: [
                {
                    model: Hall,
                    attributes: ['name', 'capacity']
                },
                {
                    model: TimeSlot,
                    attributes: ['name', 'startTime', 'endTime']
                }
            ]
        });
    }

    // Lấy sự kiện theo khoảng thời gian
    async getEventsByDateRange(startDate, endDate) {
        return await this.findAll({
            where: {
                eventDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Hall,
                    attributes: ['name', 'capacity']
                },
                {
                    model: TimeSlot,
                    attributes: ['name', 'startTime', 'endTime']
                }
            ],
            order: [['eventDate', 'ASC']] // Sắp xếp theo ngày tăng dần
        });
    }

    // Kiểm tra sảnh có sẵn trong khung giờ
    async checkHallAvailability(hallId, eventDate, timeSlotId) {
        // Kiểm tra sảnh có tồn tại không
        const hall = await Hall.findByPk(hallId);
        if (!hall) {
            throw new Error('Sảnh không tồn tại');
        }

        // Kiểm tra time slot có tồn tại không
        const timeSlot = await TimeSlot.findByPk(timeSlotId);
        if (!timeSlot) {
            throw new Error('Khung giờ không tồn tại');
        }

        // Tìm các sự kiện đã đặt sảnh trong khung giờ này
        const conflictingEvents = await this.findAll({
            where: {
                hallId,
                eventDate,
                timeSlotId,
                status: {
                    [Op.notIn]: ['cancelled'] // Không tính các sự kiện đã hủy
                }
            }
        });

        // Nếu không có sự kiện nào xung đột, sảnh có sẵn
        return conflictingEvents.length === 0;
    }

    // Cập nhật trạng thái sự kiện
    async updateEventStatus(id, status) {
        const event = await this.findById(id);
        if (!event) {
            throw new Error('Sự kiện không tồn tại');
        }

        // Validate status
        const validStatuses = ["pending", "confirmed", "paid", "done", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error('Trạng thái không hợp lệ');
        }

        // Cập nhật status
        event.status = status;
        await event.save();

        // Trả về thông tin sự kiện đã cập nhật
        return await this.getEventById(id);
    }

    // Lấy sự kiện theo ID người dùng
    async getEventsByUserId(userId) {
        return await this.findAll({
            where: { userId },
            include: [
                {
                    model: Hall,
                    attributes: ['name', 'capacity']
                },
                {
                    model: TimeSlot,
                    attributes: ['name', 'startTime', 'endTime']
                }
            ],
            order: [['eventDate', 'DESC']]
        });
    }
}

module.exports = new EventService();