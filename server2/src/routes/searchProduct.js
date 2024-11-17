// routes/searchProduct.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/searchProduct');

// Định tuyến API tìm kiếm sản phẩm theo tên
router.get('/', productController.searchProductsByName);

// Định tuyến API tìm kiếm sản phẩm theo ID
router.get('/id/:productId', productController.searchProductById);

module.exports = router;
