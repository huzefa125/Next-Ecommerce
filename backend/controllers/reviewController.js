import Review from "../models/Review.js";
import Order from "../models/Order.js";

// ==========================================
// ⭐ CREATE OR UPDATE REVIEW
// ==========================================
export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
      userId,
      "items.productId": productId
    });

    if (!hasPurchased) {
      return res.status(400).json({
        message: "You can only review products you have purchased."
      });
    }

    // Check if review exists → If yes, update it
    let existingReview = await Review.findOne({ userId, productId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      return res.status(200).json({
        message: "Review updated successfully",
        review: existingReview
      });
    }

    // Otherwise create new review
    const review = new Review({
      userId,
      productId,
      rating,
      comment,
      verifiedBuyer: true,
    });

    await review.save();

    return res.status(201).json({
      message: "Review submitted successfully",
      review
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// ⭐ GET PRODUCT REVIEWS
// ==========================================
export const getProductReview = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
