const {
  Order,
  OrderItem,
  Payment,
  Brand,
  ProductImage,
  Product,
} = require("../models"); // Giả định bạn đã có model

const OrderService = {
  // Dịch vụ tạo đơn hàng
  async createOrder(orderData) {
    const {
      user_id,
      shipping,
      subTotal,
      total,
      deliver_status,
      payment_status,
      date,
      name, // Thêm name
      phone, // Thêm phone
    } = orderData;

    // Tạo đơn hàng
    const newOrder = await Order.create({
      user_id,
      shipping,
      subTotal,
      total,
      deliver_status,
      payment_status,
      date,
      name, // Lưu name vào cơ sở dữ liệu
      phone, // Lưu phone vào cơ sở dữ liệu
    });
    return newOrder;
  },
  // Dịch vụ thêm sản phẩm vào đơn hàng
  async addOrderItems(orderItems) {
    for (const item of orderItems) {
      if (!item.order_id || !item.product_id || !item.quantity || !item.price) {
        throw new Error("Missing required fields in order item.");
      }
      await OrderItem.create(item);
    }
  },

  // Dịch vụ lưu thông tin thanh toán
  async createPayment(paymentData) {
    const { order_id, paymentMethod, paymentStatus, amount, paymentDate } =
      paymentData;

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
                    attributes: ["name", "image"], // Lấy cả tên và hình ảnh thương hiệu
                  },
                  {
                    model: ProductImage, // Lấy hình ảnh của sản phẩm
                    attributes: ["imageUrl"], // Lấy đường dẫn hình ảnh của sản phẩm
                  },
                ],
              },
            ],
          },
          {
            model: Payment,
          },
        ],
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders: " + error.message);
    }
  },

  async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: Brand, // Include brand information
                    attributes: ["name", "image"], // Include brand name and image
                  },
                  {
                    model: ProductImage, // Include product images
                    attributes: ["imageUrl"], // Include image URL
                  },
                ],
              },
            ],
          },
          {
            model: Payment, // Include payment information
          },
        ],
      });

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error("Error fetching order: " + error.message);
    }
  },
  async updateOrderStatus(orderId, status) {
    if (typeof status !== "string") {
      throw new Error("deliver_status phải là chuỗi");
    }

    return await Order.update(
      { deliver_status: status },
      { where: { id: orderId } }
    );
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
      throw new Error("Error deleting order: " + error.message);
    }
  },

  async getOrderPayments(orderId) {
    try {
      // Kiểm tra xem orderId có tồn tại trong bảng Payment không
      const payments = await Payment.findAll({ where: { order_id: orderId } });
      if (!payments.length) {
        throw new Error("No payments found for this order.");
      }
      return payments;
    } catch (error) {
      throw new Error("Error fetching order payments: " + error.message);
    }
  },

  async updateOrderAddress(orderId, orderData) {
    // Đầu tiên, kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    // Cập nhật trường shipping
    const [updatedRowCount] = await Order.update(
      { shipping: orderData },
      { where: { id: orderId } }
    );

    if (updatedRowCount === 0) {
      throw new Error("Order address not updated.");
    }

    // Trả về đơn hàng đã được cập nhật
    return await Order.findByPk(orderId);
  },
  //edit

  // OrderService.js

  async updateOrderContact(orderId, contactData) {
    // Tìm đơn hàng theo ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    // Cập nhật tên và số điện thoại
    const [updatedRowCount] = await Order.update(
      { name: contactData.name, phone: contactData.phone },
      { where: { id: orderId } }
    );

    if (updatedRowCount === 0) {
      throw new Error("Order contact not updated.");
    }

    // Trả về đơn hàng đã được cập nhật
    return await Order.findByPk(orderId);
  },
  async getOrderItems(orderId) {
    try {
      // Sử dụng include để lấy thông tin chi tiết của sản phẩm và thương hiệu
      const items = await OrderItem.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: Product,
            as: "Product",
            include: [
              {
                model: Brand,
                as: "Brand",
              },
              {
                model: ProductImage,
                as: "ProductImages",
              },
            ],
          },
        ],
      });

      if (!items.length) {
        throw new Error("No items found for this order.");
      }

      return items;
    } catch (error) {
      throw new Error("Error fetching order items: " + error.message);
    }
  },

  // Phương thức để lấy tất cả đơn hàng từ cơ sở dữ liệu
  async getAllOrders(where) {
    try {
      const orders = await Order.findAll({
        where: where, // Áp dụng điều kiện tìm kiếm
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ["name", "price"],
                include: [
                  {
                    model: Brand,
                    attributes: ["name", "image"],
                  },
                  {
                    model: ProductImage,
                    attributes: ["imageUrl"],
                  },
                ],
              },
            ],
          },
          {
            model: Payment,
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      console.log("Fetched Orders with Items:", orders);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Error fetching orders: " + error.message);
    }
  }
  ,
};

module.exports = OrderService;
