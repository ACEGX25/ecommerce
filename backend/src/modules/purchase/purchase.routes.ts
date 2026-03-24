import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "./purchase.controller";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";

const router = Router();

// User routes
router.post("/",               requireAuth,               createOrder);
router.get("/my",              requireAuth,               getMyOrders);

// Admin routes — changed from "/" to "/all"
router.get("/all",             requireAuth, requireAdmin, getAllOrders);

// Dynamic routes last
router.get("/:id",             requireAuth,               getOrderById);
router.patch("/:id/status",    requireAuth, requireAdmin, updateOrderStatus);
router.delete("/:id",          requireAuth, requireAdmin, deleteOrder);

export default router;
