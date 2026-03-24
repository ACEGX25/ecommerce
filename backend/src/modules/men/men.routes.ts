import { Router } from "express";
import {
  getAllMen,
  getMenById,
  getMenByCategory,
  getMenCategories,
  createMen,
  updateMen,
  deleteMen,
} from "./men.controller";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";
import { upload } from "../middleware/upload";
import { uploadMenImage } from "./men.controller";

const router = Router();

// Public
router.get("/",                        getAllMen);
router.get("/categories",              getMenCategories);
router.get("/category/:subcategory",   getMenByCategory);
router.get("/:id",                     getMenById);

// Admin only
router.post("/",      requireAuth, requireAdmin, createMen);
router.put("/:id",    requireAuth, requireAdmin, updateMen);
router.delete("/:id", requireAuth, requireAdmin, deleteMen);

router.post("/upload", requireAuth, requireAdmin, upload.single("image"), uploadMenImage);

export default router;