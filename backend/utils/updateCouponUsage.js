import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");

async function updateCouponUsage() {
  try {
    console.log("🔧 Updating OFF30 coupon usage...");
    
    const coupon = await Coupon.findOne({ code: "OFF30" });
    
    if (coupon) {
      console.log(`Before: Used count = ${coupon.usedCount}, Used by = ${coupon.usedBy.length} users`);
      
      // Add the user who used the coupon (assuming it's the same user for both orders)
      const userId = "69381e42282660699c4b0943";
      
      if (!coupon.usedBy.includes(userId)) {
        coupon.usedBy.push(userId);
        coupon.usedCount += 1;
        
        await coupon.save();
        
        console.log(`After: Used count = ${coupon.usedCount}, Used by = ${coupon.usedBy.length} users`);
        console.log("✅ Coupon usage updated!");
      } else {
        console.log("User already in coupon usedBy list");
      }
    }

  } catch (error) {
    console.error("Error updating coupon usage:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateCouponUsage();