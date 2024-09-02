'use strict';

const db = require('../models');
const { Review } = db;

// GET REVIEWS FOR A PRODUCT
const getReviewsService = async (productId) => {
    try {
        const reviews = await Review.findAll({
            where: { product_id: productId },
            include: [
                {
                    model: db.User,
                    attributes: ['name'], // Include user name in the response
                }
            ],
            raw: true
        });

        return {
            err: reviews.length > 0 ? 0 : 1,
            msg: reviews.length > 0 ? 'OK' : 'No reviews found',
            response: reviews
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ADD A REVIEW
const addReviewService = async (reviewData) => {
    try {
        const newReview = await Review.create(reviewData);
        return {
            err: 0,
            msg: 'Review added successfully',
            response: newReview
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getReviewsService,
    addReviewService
};
