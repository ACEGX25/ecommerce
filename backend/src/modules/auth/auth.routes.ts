// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { validate } from "../../utils/validate";
import { loginSchema, registerSchema } from "../auth/auth.types";
import { register, login, refresh, logout, me } from "../auth/auth.controller";
import { requireAuth } from "../middleware/requireauth";
import { authLimiter } from "../middleware/ratelimiter";

const router = Router();

// Public routes — rate limited
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login",    authLimiter, validate(loginSchema),    login);
router.post("/refresh",  authLimiter, refresh);
router.post("/logout",   logout);

// Protected route
router.get("/me", requireAuth, me);

export default router;