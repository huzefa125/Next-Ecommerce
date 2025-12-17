import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from "../controllers/productController.js";
import { isAuth, isAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", isAuth, isAdmin, upload.array("images", 5), createProduct);

// FEATURED MUST COME BEFORE :id
router.get("/featured", getFeaturedProducts);

router.get("/", getProducts);
router.get("/category/:slug", getProductsByCategory);
router.get("/:id", getProductById);

router.put("/:id", isAuth, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", isAuth, isAdmin, deleteProduct);

export default router;
