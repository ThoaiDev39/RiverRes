'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thay đổi kiểu dữ liệu của cột status
    await queryInterface.changeColumn('Events', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'paid', 'done', 'cancelled'),
      defaultValue: 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Khôi phục lại kiểu dữ liệu cũ
    await queryInterface.changeColumn('Events', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'paid', 'cancelled'),
      defaultValue: 'pending'
    });
  }
}; 