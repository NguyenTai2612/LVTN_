'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    static associate(models) {
      SubCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
      SubCategory.hasMany(models.Product, { foreignKey: 'sub_category_id' });
    }
  }
  SubCategory.init({
    category_id: DataTypes.INTEGER,
    subCat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SubCategory',
  });
  return SubCategory;
};
