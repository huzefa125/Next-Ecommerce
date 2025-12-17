import Category from "../models/Category.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE CATEGORY ================= */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Upload image to Cloudinary
    let image = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      image = result.secure_url;
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

/* ================= GET ALL CATEGORIES ================= */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ================= GET CATEGORY BY SLUG ================= */
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }

    // Update image if a new file is uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      category.image = result.secure_url;
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};
