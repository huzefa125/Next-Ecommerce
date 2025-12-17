import mongoose from "mongoose";
import Category from "./models/Category.js";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

const createDefaultCategories = async () => {
  try {
    const categories = [
      { name: "Utensils", image: "" },
      { name: "Steel", image: "" },
      { name: "Copper", image: "" },
    ];

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create({
          name: cat.name,
          slug: slugify(cat.name),
          image: cat.image,
        });
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }
  } catch (error) {
    console.error("Error creating categories:", error);
  }
};

const run = async () => {
  await connectDB();
  await createDefaultCategories();
  process.exit(0);
};

run();