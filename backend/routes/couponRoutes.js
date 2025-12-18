import express from "express";
import  { applyCoupon,createCoupon,updateCoupon,deleteCoupon,getCoupons } from "../controllers/couponController.js";
import { isAuth,isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", isAuth, applyCoupon);


router.post("/create", isAuth,isAdmin, createCoupon);
router.put("/:id", isAuth,isAdmin, updateCoupon);
router.delete("/:id", isAuth,isAdmin, deleteCoupon);
router.get("/", isAuth,isAdmin, getCoupons);

export default router;