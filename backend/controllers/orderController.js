import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ==========================
// 📌 PLACE ORDER
// ==========================
export const placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // 1️⃣ Check stock for each item
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // 2️⃣ Deduct stock after validation
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 3️⃣ Create order
    const newOrder = await Order.create({
      userId,
      items,
      total,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.log("Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while placing order",
      error: error.message,
    });
  }
};


// ==========================
// 📌 GET USER ORDERS
// ==========================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Fetch Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// ==========================
// 📌 UPDATE ORDER STATUS (ADMIN)
// ==========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.log("Update Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// ==========================
// 📌 GET ALL ORDERS (ADMIN)
// ==========================
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image")
      .populate("userId", "username email");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
