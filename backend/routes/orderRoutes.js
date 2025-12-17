import express from 'express';
import { placeOrder,getUserOrders,updateOrderStatus,getAllOrders } from "../controllers/orderController.js";
import { isAuth } from "../middleware/auth.js"
const router = express.Router();

router.post("/",isAuth,placeOrder);
router.get("/",isAuth,getUserOrders);
router.put("/:id",isAuth,updateOrderStatus);
router.get("/admin",isAuth,getAllOrders);

export default router;