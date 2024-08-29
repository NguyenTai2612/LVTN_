'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductSpecification extends Model {
    static associate(models) {
      ProductSpecification.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  ProductSpecification.init({
    product_id: DataTypes.INTEGER,
    spec_key: DataTypes.STRING,
    spec_value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductSpecification',
  });
  return ProductSpecification;
};
