import { Router } from "express";
import {
  getAllWomen,
  getWomenById,
  createWomen,
  updateWomen,
  deleteWomen,
} from "./women.controller";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";

const router = Router();

// Public
router.get("/",       getAllWomen);
router.get("/:id",    getWomenById);

// Admin only
router.post("/",      requireAuth, requireAdmin, createWomen);
router.put("/:id",    requireAuth, requireAdmin, updateWomen);
router.delete("/:id", requireAuth, requireAdmin, deleteWomen);

export default router;