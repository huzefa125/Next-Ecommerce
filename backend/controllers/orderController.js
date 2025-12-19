import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// ==========================
// 📌 PLACE ORDER
// ==========================
export const placeOrder = async (req, res) => {
  try {
    const { items, couponCode } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subTotal = 0;

    // ✅ Stock check + subtotal calculation
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      subTotal += product.price * item.quantity;
    }

    let discount = 0;
    let appliedCoupon = null;

    // ✅ Coupon validation (optional)
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      if (coupon.usedBy.includes(userId)) {
        return res.status(400).json({ message: "Coupon already used" });
      }

      if (new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (subTotal < coupon.minOrderValue) {
        return res.status(400).json({
          message: `Minimum order ₹${coupon.minOrderValue}`,
        });
      }

      if (coupon.discountType === "percentage") {
        discount = (subTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      coupon.usedCount += 1;
      coupon.usedBy.push(userId);
      await coupon.save();

      appliedCoupon = coupon.code;
    }

    const totalPaid = Math.max(subTotal - discount, 0);

    // ✅ Deduct stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ Create Order
    const order = await Order.create({
      userId,
      items,
      subTotal,
      discount,
      coupon: appliedCoupon,
      totalPaid,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 📌 GET USER ORDERS
// ==========================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price");

    // Fix discount calculation for all orders
    for (let order of orders) {
      // Calculate subTotal if missing
      if (!order.subTotal) {
        order.subTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      // For orders with coupon but no discount calculated
      if (order.coupon && (!order.discount || order.discount === 0)) {
        const coupon = await Coupon.findOne({ code: order.coupon });
        if (coupon) {
          let discount = 0;
          if (coupon.discountType === "percentage") {
            discount = (order.subTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = Math.min(coupon.discountValue, order.subTotal);
          }
          order.discount = discount;
          order.totalPaid = Math.max(order.subTotal - discount, 0);
          
          // Save the updated order
          try {
            await order.save();
          } catch (saveError) {
            // If save fails, at least return the correct values in response
            console.log("Could not save order:", saveError.message);
          }
        }
      } else if (order.totalPaid == null) {
        // Recalculate totalPaid if missing
        order.totalPaid = Math.max(order.subTotal - (order.discount || 0), 0);
      }
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 📌 UPDATE ORDER STATUS (Admin)
// ==========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// 📌 GET ALL ORDERS (Admin)
// ==========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "username email")
      .populate("items.productId", "name price");

    // Ensure totalPaid is set for old orders
    for (let order of orders) {
      if (order.totalPaid == null) {
        // If subTotal missing, calculate from items
        if (!order.subTotal) {
          order.subTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        order.totalPaid = Math.max(order.subTotal - (order.discount || 0), 0);
        // Don't save
      } else if (order.discount == 0 && order.coupon) {
        // Recalculate discount for old orders with coupon but no discount
        const coupon = await Coupon.findOne({ code: order.coupon });
        if (coupon) {
          let discount = 0;
          if (coupon.discountType === "percentage") {
            discount = (order.subTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          order.discount = discount;
          order.totalPaid = Math.max(order.subTotal - discount, 0);
          await order.save();
        }
      }
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
