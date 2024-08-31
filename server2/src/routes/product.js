const express = require('express');
const { getProducts } = require('../controllers/product');

const router = express.Router();

router.get('/all', getProducts); // Route to get all products

module.exports = router;
