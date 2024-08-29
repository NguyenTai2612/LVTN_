'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      oldPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      brand_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Brands',
          key: 'id'
        }
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SubCategories',
          key: 'id'
        }
      },
      countInStock: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2)
      },
      isFeatured: {
        type: Sequelize.BOOLEAN
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2)
      },
      dateCreated: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
