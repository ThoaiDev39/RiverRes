class BaseService {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const instance = await this.findById(id);
        if (!instance) {
            throw new Error('Không tìm thấy bản ghi');
        }
        return await instance.update(data);
    }

    async delete(id) {
        const instance = await this.findById(id);
        if (!instance) {
            throw new Error('Không tìm thấy bản ghi');
        }
        return await instance.destroy();
    }

    // Phương thức validate dữ liệu cơ bản
    validate(data, rules) {
        const errors = [];
        for (const [field, rule] of Object.entries(rules)) {
            if (rule.required && !data[field]) {
                errors.push(`${field} không được để trống`);
            }
            if (rule.minLength && data[field]?.length < rule.minLength) {
                errors.push(`${field} phải có ít nhất ${rule.minLength} ký tự`);
            }
            if (rule.maxLength && data[field]?.length > rule.maxLength) {
                errors.push(`${field} không được vượt quá ${rule.maxLength} ký tự`);
            }
        }
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
        return true;
    }
}

module.exports = BaseService; 