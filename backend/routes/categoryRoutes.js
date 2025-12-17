import express from "express";
import {
  getCategories,
  createCategory,
  getCategoryBySlug,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAuth, isAdmin } from "../middleware/auth.js";
import { categoryUpload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", isAuth, isAdmin, categoryUpload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.delete("/:id", isAuth, isAdmin, deleteCategory);
router.put("/:id", isAuth, isAdmin, categoryUpload.single("image"), updateCategory);

export default router;
