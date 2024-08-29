'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
  }
  Payment.init({
    order_id: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    paymentDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};
