import mongoose from "mongoose";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");

async function fixSpecificOrders() {
  try {
    console.log("🔧 Fixing specific orders with OFF30 coupon...");
    
    // The two pending orders with ₹3000 that should have had OFF30 applied
    const orderIds = [
      "6944d4ecffad5ab888904a2c", // Order placed today
      "6943ec202e45fb2d07bde72e"  // Order from yesterday
    ];

    for (let orderId of orderIds) {
      const order = await Order.findById(orderId);
      
      if (order && order.subTotal === 3000 && order.discount === 0) {
        console.log(`\n📝 Updating order ${orderId}`);
        console.log(`   Before: Subtotal=₹${order.subTotal}, Discount=₹${order.discount}, TotalPaid=₹${order.totalPaid}`);
        
        // Apply OFF30 coupon (30% discount)
        const discountAmount = Math.min((order.subTotal * 30) / 100, 10000); // 30% with max ₹10000
        
        order.discount = discountAmount;
        order.totalPaid = order.subTotal - discountAmount;
        order.coupon = "OFF30";
        
        await order.save();
        
        console.log(`   After:  Subtotal=₹${order.subTotal}, Discount=₹${order.discount}, TotalPaid=₹${order.totalPaid}`);
        console.log(`   ✅ Order updated successfully!`);
      } else {
        console.log(`   ❌ Order ${orderId} not found or already has discount applied`);
      }
    }

  } catch (error) {
    console.error("Error fixing orders:", error);
  } finally {
    mongoose.connection.close();
  }
}

fixSpecificOrders();