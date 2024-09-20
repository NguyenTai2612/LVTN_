const express = require('express');
const router = express.Router();
const productController = require('../controllers/deleteAll');

// Xóa nhiều sản phẩm cùng với ảnh và thông số
router.delete('/products', productController.deleteMultipleProducts);

// Xóa nhiều ảnh sản phẩm
router.delete('/product-images', productController.deleteMultipleProductImages);

// Xóa nhiều thông số sản phẩm
router.delete('/product-specifications', productController.deleteMultipleProductSpecifications);

module.exports = router;
