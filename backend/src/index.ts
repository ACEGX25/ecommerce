import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { ENV } from "./config/env";
import { globalLimiter } from "./modules/middleware/ratelimiter";
import { errorHandler } from "./modules/middleware/errorhandler";

// Route modules
import authRoutes     from "./modules/auth/auth.routes";
import usersRoutes    from "./modules/users/users.routes";
import womenRoutes    from "./modules/women/women.routes";
import purchaseRoutes from "./modules/purchase/purchase.routes";

const app = express();

// ─── Security middleware ──────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
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
app.use("/api/women",        womenRoutes);
app.use("/api/purchase",     purchaseRoutes);

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