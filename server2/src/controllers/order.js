const OrderService = require("../services/order");
const { OrderItem } = require("../models");

const OrderController = {
  // API để tạo đơn hàng
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const newOrder = await OrderService.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
    }
  },

  // API để thêm sản phẩm vào đơn hàng
  async addOrderItems(req, res) {
    try {
      const { orderId, items } = req.body;

      // Xác minh dữ liệu
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: "Invalid data format. Expected an array of order items.",
        });
      }

      // Thêm sản phẩm vào đơn hàng
      for (const item of items) {
        await OrderItem.create({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        });
      }

      return res
        .status(200)
        .json({ message: "Order items added successfully." });
    } catch (error) {
      console.error("Error adding order items:", error);
      return res
        .status(500)
        .json({ message: "Error adding order items.", error: error.message });
    }
  },

  // API để lưu thông tin thanh toán
  async createPayment(req, res) {
    try {
      const paymentData = req.body;
      const newPayment = await OrderService.createPayment(paymentData);
      res.status(201).json(newPayment);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lưu thông tin thanh toán",
        error: error.message,
      });
    }
  },

  async getOrdersByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const orders = await OrderService.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch orders", error: error.message });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders); // Trả về dữ liệu
    } catch (error) {
      res.status(500).json({ error: error.message }); // Trả về lỗi nếu có
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.orderId);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const updatedOrder = await OrderService.updateOrderStatus(
        req.params.orderId,
        req.body.status
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Controller xóa đơn hàng
  async deleteOrder(req, res) {
    try {
      const result = await OrderService.deleteOrder(req.params.orderId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Controller để lấy thông tin thanh toán của một đơn hàng
  async getOrderPayments(req, res) {
    try {
      const payments = await OrderService.getOrderPayments(req.params.orderId);
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateOrderAddress(req, res) {
    try {
        console.log("Order ID:", req.params.orderId);  // Log orderId
        console.log("Order Data:", req.body);  // Log incoming address data

        const updatedOrder = await OrderService.updateOrderAddress(req.params.orderId, req.body);

        res.status(200).json({ message: "Order address updated successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
,

  // Controller để lấy thông tin sản phẩm trong một đơn hàng
  async getOrderItems(req, res) {
    try {
      const items = await OrderService.getOrderItems(req.params.orderId);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 
};

module.exports = OrderController;
