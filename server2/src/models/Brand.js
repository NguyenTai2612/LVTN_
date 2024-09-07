'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, { foreignKey: 'brand_id' });
    }
  }
  Brand.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING  // Change description to image
  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};
