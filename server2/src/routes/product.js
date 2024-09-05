const express = require('express');
const { getProducts } = require('../controllers/product');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/all', getProducts); // Route to get all products

router.get('/:id/details', productController.getProductDetails);

router.post('/create', productController.createProduct);

router.put('/:id/update', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
