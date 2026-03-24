import { Router } from "express";
import { getAllOrdersAdmin, getOrdersSummary } from "./admin.controller";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";

const router = Router();

// ─── All admin order routes require auth + admin role ─────────
router.get("/",        requireAuth, requireAdmin, getAllOrdersAdmin);
router.get("/summary", requireAuth, requireAdmin, getOrdersSummary);

export default router;