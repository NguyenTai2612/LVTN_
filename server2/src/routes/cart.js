const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

// Thêm sản phẩm vào giỏ hàng
router.post('/', cartController.addToCart);

// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
router.get('/:userId', cartController.getCartByUserId);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/:cartId', cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:cartId', cartController.deleteCartItem);

module.exports = router;
