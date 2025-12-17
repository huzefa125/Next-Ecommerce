import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

/* ============================================================
   ⭐ HELPER → UPDATE PRODUCT AVERAGE RATING & REVIEW COUNT
============================================================ */
export const updateProductStats = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: stats[0].avgRating.toFixed(1),
        reviewsCount: stats[0].totalReviews
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        reviewsCount: 0
      });
    }
  } catch (err) {
    console.log("Product stats update failed:", err.message);
  }
};

/* ============================================================
   ⭐ CREATE OR UPDATE REVIEW
============================================================ */
export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required."
      });
    }

    // Validate product ID or slug
    let product;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ slug: productId });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check purchase history
    const hasPurchased = await Order.findOne({
      userId,
      "items.productId": product._id
    });

    if (!hasPurchased) {
      return res.status(400).json({
        message: "You can only review products you have purchased."
      });
    }

    // Check if user already reviewed → update review
    let existing = await Review.findOne({ userId, productId: product._id });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();

      // Update product stats
      await updateProductStats(product._id);

      return res.status(200).json({
        message: "Review updated successfully",
        review: existing
      });
    }

    // Otherwise, create new review
    const newReview = await Review.create({
      userId,
      productId: product._id,
      rating,
      comment,
      verifiedBuyer: true
    });

    // Update stats
    await updateProductStats(product._id);

    return res.status(201).json({
      message: "Review submitted successfully",
      review: newReview
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

/* ============================================================
   ⭐ UPDATE REVIEW BY ID
   ============================================================ */
export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product stats
    await updateProductStats(review.productId);

    res.status(200).json({
      message: "Review updated successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

/* ============================================================
   ⭐ GET PRODUCT REVIEWS
============================================================ */
export const getProductReview = async (req, res) => {
  try {
    const { id } = req.params;

    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const reviews = await Review.find({ productId: product._id })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
