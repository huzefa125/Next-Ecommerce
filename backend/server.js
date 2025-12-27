import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"
import couponRoutes from "./routes/couponRoutes.js";

import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

// Secure: hide framework info
app.disable('x-powered-by');

// Parse cookies for auth flows
app.use(cookieParser());

// CORS: allow comma-separated origins from env var (CORS_ORIGIN) or single FRONTEND_URL
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3000").split(',').map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "cache-control"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Trust proxy for rate limiting (important for hosting platforms like Render)
app.set('trust proxy', 1);

app.use(express.json());

// ==========================================
// Rate Limits
// ==========================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});
app.use("/auth", authLimiter);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/upload", uploadRoutes);
app.use("/products",productRoutes);
app.use("/uploads",express.static("uploads"));
app.use("/api/carts",cartRoutes);
app.use("/categories",categoryRoutes);
app.use("/orders",orderRoutes);
app.use("/reviews",reviewRoutes);
app.use("/coupons", couponRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

(async () => {
  await db.connect();
})();
