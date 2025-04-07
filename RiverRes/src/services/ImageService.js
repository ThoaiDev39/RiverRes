const Image = require('../models/Image');
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');

class ImageService {
    static async saveImage(file, entityType, entityId) {
        // Chuyển đổi entityType để phù hợp với database
        const dbEntityType = entityType === 'dishes' ? 'dish' : 'hall';
        
        const imageData = {
            entityType: dbEntityType,
            entityId,
            fileName: file.filename,
            originalName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
            isPrimary: false
        };
        return await Image.create(imageData);
    }

    static async getImages(entityType, entityId) {
        // Chuyển đổi entityType để phù hợp với database
        const dbEntityType = entityType === 'dishes' ? 'dish' : 'hall';
        
        return await Image.findAll({
            where: {
                entityType: dbEntityType,
                entityId
            },
            order: [
                ['isPrimary', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
    }

    static async deleteImage(imageId) {
        const image = await Image.findByPk(imageId);
        if (!image) {
            throw new Error('Không tìm thấy ảnh');
        }
        
        try {
            // Xóa file
            await fs.unlink(image.filePath);
            // Xóa record
            await image.destroy();
            return true;
        } catch (error) {
            throw new Error('Lỗi khi xóa ảnh: ' + error.message);
        }
    }

    static async setPrimaryImage(imageId, entityType, entityId) {
        // Chuyển đổi entityType để phù hợp với database
        const dbEntityType = entityType === 'dishes' ? 'dish' : 'hall';
        
        // Reset tất cả ảnh của entity này thành không phải primary
        await Image.update(
            { isPrimary: false },
            {
                where: {
                    entityType: dbEntityType,
                    entityId
                }
            }
        );
        
        // Set ảnh được chọn thành primary
        const image = await Image.findByPk(imageId);
        if (!image) {
            throw new Error('Không tìm thấy ảnh');
        }
        
        image.isPrimary = true;
        return await image.save();
    }
}

module.exports = ImageService; 