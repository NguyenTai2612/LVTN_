'use strict';

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');

// Get reviews for a product
router.get('/:productId', reviewController.getReviews);

// Add a review
router.post('/', reviewController.addReview);

module.exports = router;
