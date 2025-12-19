import express from "express";
import {
  getCart,
  addToCart,
  updateQty,
  removeItem,
  clearCart,
  updateCartLocation,
} from "../controllers/cartController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// GET USER CART
router.get("/", isAuth, getCart);

// ADD TO CART
router.post("/add", isAuth, addToCart);

// UPDATE QTY
router.patch("/update/:productId", isAuth, updateQty);

// REMOVE ITEM
router.delete("/remove/:productId", isAuth, removeItem);

// CLEAR CART
router.delete("/clear", isAuth, clearCart);

// UPDATE CART LOCATION
router.patch("/location", isAuth, updateCartLocation);

export default router;
