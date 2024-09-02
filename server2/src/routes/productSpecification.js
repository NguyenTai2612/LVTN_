const express = require('express');
const router = express.Router();
const productSpecificationController = require('../controllers/productSpecification');

// Lấy tất cả thông số kỹ thuật của một sản phẩm
router.get('/:productId', productSpecificationController.getProductSpecifications);

module.exports = router;
