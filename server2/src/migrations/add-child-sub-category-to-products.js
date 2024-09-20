'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'child_sub_category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ChildSubCategories', // Tên bảng ChildSubCategories
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Hoặc 'RESTRICT' tùy vào yêu cầu
      allowNull: true // Cho phép giá trị null nếu cần
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'child_sub_category_id');
  }
};
