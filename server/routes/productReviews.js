const { ProductReviews } = require("../models/productReviews");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const review = await ProductReviews.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "The review with the given ID was not found." });
    }

    return res.status(200).send(review);
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred.", error: error.message });
  }
});

router.get(`/`, async (req, res) => {
  try {
    let reviews = [];

    if (req.query.productId) {
      reviews = await ProductReviews.find({ productId: req.query.productId });
    } else {
      reviews = await ProductReviews.find();
    }

    if (!reviews) {
      return res.status(404).json({ success: false, message: "No reviews found." });
    }

    return res.status(200).json(reviews);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving reviews.",
      error: error.message
    });
  }
});


router.get("/:id", async (req, res) => {
  const review = await ProductReviews.findById(req.params.id);

  if (!review) {
    res
      .status(500)
      .json({ message: "The review with the given ID was not found." });
  }

  return res.status(200).send(review);
});

// edit 
router.post('/add', async (req, res) => {
  try {
    let review = new ProductReviews({
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      review: req.body.review,
      customerRating: req.body.customerRating,
      productId: req.body.productId
    });

    review = await review.save();

    if (!review) {
      return res.status(500).json({ success: false, message: "Review could not be created." });
    }

    return res.status(201).send(review);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the review.",
      error: error.message
    });
  }
});


module.exports = router;
