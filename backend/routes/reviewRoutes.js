import express, { Router } from "express";
import {getProductReview,createReview, updateReview} from "../controllers/reviewController.js";
import { isAuth  } from "../middleware/auth.js";

const router = express.Router();

router.post("/",isAuth,createReview);
router.put("/:id", isAuth, updateReview);
router.get("/:id",getProductReview);

export default router;