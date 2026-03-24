// src/index.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { ENV } from "../src/config/env";
import { globalLimiter } from "../src/modules/middleware/ratelimiter";
import { errorHandler } from "../src/modules/middleware/errorhandler";

// Route modules
import authRoutes  from "../src/modules/auth/auth.routes";
import usersRoutes from "../src/modules/users/users.routes";
import { getAllOrders, getOrdersSummary } from "./modules/orders/orders.controller";
import { getUsers } from "./modules/users/users.controller";
import { getAllProducts, createProduct } from "./modules/products/products.controller";
import ordersRoutes from "../src/modules/orders/orders.routes";
import cartRoutes from "../src/modules/cart/cart.routes";

const app = express();

// ─── Security middleware ──────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,   // allow cookies (refresh token)
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API routes ───────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/admin/users",  usersRoutes);
//orders route
app.get("/api/orders",         getAllOrders);
app.get("/api/orders/summary", getOrdersSummary);
//users route
app.get("/api/users",       getUsers);
//products route
app.get("/api/products",    getAllProducts);
app.post("/api/products",   createProduct);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);

// ─── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────
app.listen(ENV.PORT, () => {
  console.log(`\n🚀 Dingly backend running`);
  console.log(`   http://localhost:${ENV.PORT}`);
  console.log(`   ENV: ${ENV.NODE_ENV}\n`);
});

export default app;