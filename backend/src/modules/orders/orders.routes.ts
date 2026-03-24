import { Router } from "express";
import { validate } from "../../utils/validate";
import { createOrderSchema, updateOrderStatusSchema } from "./orders.types";
import {
  getAllOrdersAdmin,
  getOrdersSummary,
  listMyOrders,
  getOrder,
  placeOrder,
  cancelMyOrder,
  adminListOrders,
  adminUpdateStatus,
} from "./orders.controller";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";

const router = Router();

// ─── User routes ──────────────────────────────────────────────
router.get("/",          requireAuth,              listMyOrders);
router.get("/:id",       requireAuth,              getOrder);
router.post("/",         requireAuth, validate(createOrderSchema), placeOrder);
router.post("/:id/cancel", requireAuth,            cancelMyOrder);
router.get("/admin", requireAuth);
router.get("/summery", requireAuth);

// ─── Admin routes ─────────────────────────────────────────────
router.get("/admin/orders",                requireAuth, requireAdmin, adminListOrders);
router.patch("/admin/orders/:id/status",   requireAuth, requireAdmin, validate(updateOrderStatusSchema), adminUpdateStatus);

export default router;