const express = require('express');
const router = express.Router();
const productSpecificationController = require('../controllers/productSpecification');

// Lấy tất cả thông số kỹ thuật của một sản phẩm
router.get('/:productId', productSpecificationController.getProductSpecifications);

router.get('/spec/:id', productSpecificationController.getProductSpecificationById);

router.post('/create', productSpecificationController.createProductSpecification);

router.put('/:id/update', productSpecificationController.updateProductSpecification);

router.delete('/:id/delete', productSpecificationController.deleteProductSpecification);

module.exports = router;
