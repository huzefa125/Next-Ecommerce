import mongoose from "mongoose";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");

async function fixOrdersWithMissingDiscounts() {
  try {
    console.log("🔍 Finding orders that need discount recalculation...");
    
    // Find all orders that have a coupon but no discount or discount is 0
    const ordersToFix = await Order.find({
      $or: [
        { coupon: { $exists: true, $ne: null }, discount: { $exists: false } },
        { coupon: { $exists: true, $ne: null }, discount: 0 }
      ]
    });

    console.log(`📝 Found ${ordersToFix.length} orders to fix`);

    for (let order of ordersToFix) {
      console.log(`\n🔧 Fixing order: ${order._id}`);
      console.log(`   Coupon: ${order.coupon}`);
      console.log(`   Current subtotal: ₹${order.subTotal}`);
      console.log(`   Current discount: ₹${order.discount || 0}`);
      console.log(`   Current totalPaid: ₹${order.totalPaid}`);

      // Calculate subTotal if missing
      if (!order.subTotal) {
        order.subTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      // Find the coupon
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

        // Update the order
        order.discount = discount;
        order.totalPaid = Math.max(order.subTotal - discount, 0);

        await order.save();

        console.log(`   ✅ Updated!`);
        console.log(`   New discount: ₹${order.discount}`);
        console.log(`   New totalPaid: ₹${order.totalPaid}`);
      } else {
        console.log(`   ❌ Coupon '${order.coupon}' not found`);
      }
    }

    console.log(`\n🎉 Successfully fixed ${ordersToFix.length} orders!`);
    
  } catch (error) {
    console.error("Error fixing orders:", error);
  } finally {
    mongoose.connection.close();
  }
}

fixOrdersWithMissingDiscounts();