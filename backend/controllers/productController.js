import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Review from "../models/Review.js";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const catExists = await Category.findById(category);
    if (!catExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Upload images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
        images.push(result.secure_url);
      }
    }

    // Generate unique slug
    let slug = slugify(name, { lower: true });
    let existingProduct = await Product.findOne({ slug });
    let counter = 1;

    while (existingProduct) {
      slug = `${slugify(name, { lower: true })}-${counter}`;
      existingProduct = await Product.findOne({ slug });
      counter++;
    }

    const product = await Product.create({
      name,
      slug,
      description: description || "",
      price: Number(price),
      images,
      stock: stock ? Number(stock) : 0,
      category,
      featured: featured === "true" || featured === true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/* ================= GET ALL PRODUCTS with Review Count ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    const updated = await Promise.all(
      products.map(async (p) => {
        const count = await Review.countDocuments({ productId: p._id });
        return { ...p._doc, reviewsCount: count };
      })
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate("category", "name slug");
    } else {
      product = await Product.findOne({ slug: id }).populate("category", "name slug");
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add Review Count
    const reviewsCount = await Review.countDocuments({ productId: product._id });

    res.json({ ...product._doc, reviewsCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/* ================= GET PRODUCTS BY CATEGORY SLUG ================= */
export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const products = await Product.find({ isActive: true })
      .populate({
        path: "category",
        match: { slug },
      });

    const filtered = products.filter((p) => p.category !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category products" });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, stock, category, isActive, featured } = req.body;

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Handle new images if uploaded
    let images = product.images;
    if (req.files && req.files.length > 0) {
      images = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
        images.push(result.secure_url);
      }
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true });
    }

    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;
    if (isActive !== undefined) product.isActive = isActive;
    if (featured !== undefined) product.featured = featured;

    product.images = images;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* ================= FEATURED PRODUCTS ================= */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      featured: true,
      isActive: true,
    })
      .select("name slug images category price")
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
};
