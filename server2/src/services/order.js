const { Order, OrderItem, Payment, Brand, ProductImage, Product } = require('../models'); // Giả định bạn đã có model

const OrderService = {
  // Dịch vụ tạo đơn hàng
  async createOrder(orderData) {
    const { user_id, shipping, subTotal, total, deliver_status, payment_status, date } = orderData;
    
    // Tạo đơn hàng
    const newOrder = await Order.create({
      user_id,
      shipping,
      subTotal,
      total,
      deliver_status,
      payment_status,
      date,
    });
    return newOrder;
  },

  // Dịch vụ thêm sản phẩm vào đơn hàng
  async addOrderItems(orderItems) {
    for (const item of orderItems) {
        if (!item.order_id || !item.product_id || !item.quantity || !item.price) {
          throw new Error('Missing required fields in order item.');
        }
        await OrderItem.create(item);
      }
  },

  // Dịch vụ lưu thông tin thanh toán
  async createPayment(paymentData) {
    const { order_id, paymentMethod, paymentStatus, amount, paymentDate } = paymentData;
    
    // Tạo bản ghi thanh toán
    const newPayment = await Payment.create({
      order_id,
      paymentMethod,
      paymentStatus,
      amount,
      paymentDate,
    });
    return newPayment;
  },

  async getOrdersByUserId(userId) {
    try {
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: Brand, // Lấy tên thương hiệu
                    attributes: ['name', 'image'], // Lấy cả tên và hình ảnh thương hiệu
                  },
                  {
                    model: ProductImage, // Lấy hình ảnh của sản phẩm
                    attributes: ['imageUrl'], // Lấy đường dẫn hình ảnh của sản phẩm
                  }
                ]
              }
            ]
          },
          {
            model: Payment
          }
        ]
      });
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders: ' + error.message);
    }
  },

  async getOrderById (orderId) {
    return await Order.findByPk(orderId);
  },
  
  async updateOrder (orderId, status) {
    return await Order.update({ status }, { where: { id: orderId } });
  },
  
  // Dịch vụ xóa đơn hàng
  async deleteOrder(orderId) {
    try {
      // Xóa các bản ghi trong OrderItem liên quan đến đơn hàng
      await OrderItem.destroy({ where: { order_id: orderId } });
      
      // Xóa các bản ghi trong Payment liên quan đến đơn hàng
      await Payment.destroy({ where: { order_id: orderId } });

      // Xóa đơn hàng
      await Order.destroy({ where: { id: orderId } });

      return { message: "Order deleted successfully." };
    } catch (error) {
      throw new Error('Error deleting order: ' + error.message);
    }
  },
  
  async getOrderPayments(orderId) {
    try {
      // Kiểm tra xem orderId có tồn tại trong bảng Payment không
      const payments = await Payment.findAll({ where: { order_id: orderId } });
      if (!payments.length) {
        throw new Error('No payments found for this order.');
      }
      return payments;
    } catch (error) {
      throw new Error('Error fetching order payments: ' + error.message);
    }
  },
  
  async updateOrder (orderId, orderData) {
    return await Order.update(orderData, { where: { id: orderId } });
  },
  
  async getOrderItems(orderId) {
    try {
      // Sử dụng include để lấy thông tin chi tiết của sản phẩm và thương hiệu
      const items = await OrderItem.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: Product,
            as: 'Product',
            include: [
              {
                model: Brand,
                as: 'Brand'
              },
              {
                model: ProductImage,
                as: 'ProductImages'
              }
            ]
          }
        ]
      });
  
      if (!items.length) {
        throw new Error('No items found for this order.');
      }
  
      return items;
    } catch (error) {
      throw new Error('Error fetching order items: ' + error.message);
    }
  },
  
  
  // Phương thức để lấy tất cả đơn hàng từ cơ sở dữ liệu
  async getAllOrders() {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem, // Bao gồm các OrderItem của Order
            include: [
              {
                model: Product, // Bao gồm Product liên quan đến mỗi OrderItem
                attributes: ['name', 'price'], // Lấy tên và giá của sản phẩm
                include: [
                  {
                    model: Brand, // Bao gồm Brand của Product
                    attributes: ['name', 'image'], // Lấy tên và hình ảnh thương hiệu
                  },
                  {
                    model: ProductImage, // Bao gồm hình ảnh của sản phẩm
                    attributes: ['imageUrl'], // Lấy đường dẫn hình ảnh của sản phẩm
                  }
                ]
              }
            ]
          },
          {
            model: Payment, // Bao gồm Payment liên quan đến Order
            
          }
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt'], // Loại bỏ các trường không cần thiết
        },
      });
      
      console.log('Fetched Orders with Items:', orders); // Log để kiểm tra
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error); // Log lỗi nếu có
      throw new Error('Error fetching orders: ' + error.message);
    }
  }
  
};

module.exports = OrderService;
