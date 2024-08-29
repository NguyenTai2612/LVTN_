'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define associations here
      Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
      Product.belongsTo(models.SubCategory, { foreignKey: 'sub_category_id' });
      Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
      Product.hasMany(models.Review, { foreignKey: 'product_id' });
      Product.hasMany(models.Cart, { foreignKey: 'product_id' });
      Product.hasMany(models.ProductSpecification, { foreignKey: 'product_id' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    oldPrice: DataTypes.DECIMAL(10, 2),
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    countInStock: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL(3, 2),
    isFeatured: DataTypes.BOOLEAN,
    discount: DataTypes.DECIMAL(5, 2),
    dateCreated: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
