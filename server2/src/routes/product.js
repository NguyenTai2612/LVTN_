const express = require('express');
const { getProducts } = require('../controllers/product');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/all', getProducts); // Route to get all products

router.get('/:id/details', productController.getProductDetails);

module.exports = router;
