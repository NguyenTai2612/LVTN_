'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'features', {
      type: Sequelize.TEXT,
      allowNull: true, // Có thể để null nếu muốn
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'features');
  }
};
