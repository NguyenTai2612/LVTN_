const express = require('express');
const router = express.Router();
const  productImageController = require('../controllers/productImage');


router.get('/:productId/images', productImageController.getProductImages);

router.post('/', productImageController.addProductImage);
router.put('/:id', productImageController.updateProductImage);
router.delete('/:id', productImageController.deleteProductImage);

module.exports = router;
