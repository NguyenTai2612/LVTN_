const mongoose = require("mongoose");

const productReviewsSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  review: {
    type: String,  // Changed from Number to String
    required: true,
  },
  customerRating: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

exports.ProductReviews = mongoose.model("ProductReviews", productReviewsSchema);
