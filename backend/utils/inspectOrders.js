import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce");

async function inspectOrders() {
  try {
    console.log("🔍 Inspecting all orders...");
    
    const orders = await Order.find({}).populate("items.productId", "name price");

    console.log(`📝 Found ${orders.length} total orders`);

    orders.forEach((order, index) => {
      console.log(`\n--- Order ${index + 1} ---`);
      console.log(`ID: ${order._id}`);
      console.log(`User ID: ${order.userId}`);
      console.log(`Status: ${order.status}`);
      console.log(`SubTotal: ₹${order.subTotal || 'undefined'}`);
      console.log(`Discount: ₹${order.discount || 0}`);
      console.log(`Coupon: ${order.coupon || 'none'}`);
      console.log(`Total Paid: ₹${order.totalPaid || 'undefined'}`);
      console.log(`Created: ${order.createdAt}`);
      console.log(`Items:`);
      order.items.forEach(item => {
        console.log(`  - ${item.productId?.name || 'Unknown'}: ₹${item.price} × ${item.quantity}`);
      });
    });

  } catch (error) {
    console.error("Error inspecting orders:", error);
  } finally {
    mongoose.connection.close();
  }
}

inspectOrders();