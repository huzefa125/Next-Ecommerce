import express, { Router } from "express";
import {getProductReview,createReview} from "../controllers/reviewController.js";
import { isAuth  } from "../middleware/auth.js";

const router = express.Router();

router.post("/",isAuth,createReview);
router.get("/:id",getProductReview);

export default router;