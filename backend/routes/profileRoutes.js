import express from "express";
import { isAuth } from "../middleware/auth.js";
import { getMyProfile, completeProfile, saveProfileImage } from "../controllers/profileControllers.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", isAuth, getMyProfile);

// Complete/update profile
router.put("/", isAuth, completeProfile);

// Update only profile image
router.put("/image", isAuth, saveProfileImage);

export default router;
