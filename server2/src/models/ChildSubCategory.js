'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChildSubCategory extends Model {
    static associate(models) {
      ChildSubCategory.belongsTo(models.SubCategory, { foreignKey: 'sub_category_id' });
      ChildSubCategory.hasMany(models.Product, { foreignKey: 'child_sub_category_id' });
    }
  }

  ChildSubCategory.init({
    sub_category_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChildSubCategory',
  });

  return ChildSubCategory;
};
