const express = require('express');
const { getProductImages } = require('../controllers/productImage');

const router = express.Router();

router.get('/:productId/images', getProductImages);

module.exports = router;
