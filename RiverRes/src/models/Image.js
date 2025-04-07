const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entityType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['hall', 'dish']]
        }
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    originalName: {
        type: DataTypes.STRING(255)
    },
    filePath: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    fileSize: {
        type: DataTypes.INTEGER
    },
    mimeType: {
        type: DataTypes.STRING(100)
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['entityType', 'entityId']
        }
    ]
});

module.exports = Image; 