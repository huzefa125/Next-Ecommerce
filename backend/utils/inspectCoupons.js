import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");

async function inspectCoupons() {
  try {
    console.log("🔍 Checking available coupons...");
    
    const coupons = await Coupon.find({});
    
    console.log(`📝 Found ${coupons.length} coupons`);

    coupons.forEach((coupon, index) => {
      console.log(`\n--- Coupon ${index + 1} ---`);
      console.log(`Code: ${coupon.code}`);
      console.log(`Discount Type: ${coupon.discountType}`);
      console.log(`Discount Value: ${coupon.discountValue}`);
      console.log(`Max Discount: ₹${coupon.maxDiscount || 'unlimited'}`);
      console.log(`Min Order Value: ₹${coupon.minOrderValue}`);
      console.log(`Active: ${coupon.isActive}`);
      console.log(`Expiry: ${coupon.expiryDate}`);
      console.log(`Used Count: ${coupon.usedCount}`);
      console.log(`Used By: ${coupon.usedBy.length} users`);
    });

  } catch (error) {
    console.error("Error inspecting coupons:", error);
  } finally {
    mongoose.connection.close();
  }
}

inspectCoupons();