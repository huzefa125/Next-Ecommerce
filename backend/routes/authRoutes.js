import express from "express";
import { register,login,logout, getAllUsers } from "../controllers/authController.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout", logout);
router.get("/", isAuth, isAdmin, getAllUsers);

export default router;