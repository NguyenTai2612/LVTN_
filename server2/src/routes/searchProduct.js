const express = require('express');
const router = express.Router();
const productController = require('../controllers/searchProduct');

// Định tuyến API tìm kiếm sản phẩm theo tên
router.get('/', productController.searchProductsByName);

module.exports = router;
