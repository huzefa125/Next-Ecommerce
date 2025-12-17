import express from 'express';
import {uploadImage } from "../controllers/uploadControllers.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post('/profile-image',isAuth,uploadImage);

export default router;