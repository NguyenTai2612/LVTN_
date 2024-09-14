const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order');

// API để tạo đơn hàng
router.post('/', OrderController.createOrder);

// API để thêm sản phẩm vào đơn hàng
router.post('/order-items', OrderController.addOrderItems);

// API để lưu thông tin thanh toán
router.post('/payments', OrderController.createPayment);

// API lấy tất cả các đơn hàng của người dùng
router.get('/user/:userId', OrderController.getOrdersByUserId);

// API để lấy chi tiết đơn hàng
router.get('/:orderId', OrderController.getOrderById);

// API để cập nhật trạng thái đơn hàng
router.put('/:orderId/status', OrderController.updateOrderStatus);

// API để xóa đơn hàng
router.delete('/:orderId', OrderController.deleteOrder);

// API để xem lịch sử thanh toán của đơn hàng
router.get('/:orderId/payments', OrderController.getOrderPayments);

// API để cập nhật thông tin đơn hàng
router.put('/:orderId', OrderController.updateOrderAddress);

router.put('/:orderId/contact', OrderController.updateOrderContact);

// API để xem tất cả các sản phẩm trong một đơn hàng
router.get('/:orderId/items', OrderController.getOrderItems);

// API để lấy tất cả đơn hàng
router.get('/', OrderController.getAllOrders);

router.get('/contact/:id', OrderController.getOrderContactById);

module.exports = router;
