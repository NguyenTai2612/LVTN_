'use strict';

const reviewService = require('../services/review');

const getReviews = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const { err, response, msg } = await reviewService.getReviewsService(productId);

        if (err) {
            return res.status(404).json({ err, msg });
        }

        return res.status(200).json({ err, response });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at review controller: ' + error.message
        });
    }
};

const addReview = async (req, res) => {
    const reviewData = {
        user_id: req.body.user_id,
        product_id: req.body.product_id,
        rating: req.body.rating,
        comment: req.body.comment,
        createdAt: new Date() // You may adjust the date format as needed
    };

    try {
        const { err, response, msg } = await reviewService.addReviewService(reviewData);

        if (err) {
            return res.status(400).json({ err, msg });
        }

        return res.status(201).json({ err, response });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at review controller: ' + error.message
        });
    }
};

module.exports = {
    getReviews,
    addReview
};
