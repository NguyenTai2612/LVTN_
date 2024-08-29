'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
      Order.hasMany(models.Payment, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    customer_id: DataTypes.STRING,
    subTotal: DataTypes.DECIMAL(10, 2),
    total: DataTypes.DECIMAL(10, 2),
    shipping: DataTypes.JSON,
    deliver_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
