import Coupon from "../models/Coupon.js";

/* =========================
   APPLY COUPON (USER)
========================= */
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res.status(400).json({ message: "Code and cart total required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" });
    }

    // Expiry check
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Duplicate use check
    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({ message: "Coupon already used by you" });
    }

    // Minimum order check
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order value is ₹${coupon.minOrderValue}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = Math.max(cartTotal - discount, 0);

    // Do not update usage here, just validate
    // coupon.usedCount += 1;
    // coupon.usedBy.push(userId);
    // await coupon.save();

    return res.status(200).json({
      success: true,
      coupon: coupon.code,
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createCoupon = async (req, res) => {
  try {
    const exists = await Coupon.findOne({
      code: req.body.code.toUpperCase(),
    });

    if (exists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase(),
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
