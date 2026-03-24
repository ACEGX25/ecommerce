import { Router } from "express";
import { validate } from "../../utils/validate";
import { addToCartSchema, updateCartItemSchema } from "./cart.types";
import {
  getMyCart,
  addItemToCart,
  updateItem,
  removeItem,
  clearMyCart,
} from "./cart.controller";
import { requireAuth } from "../middleware/requireauth";

const router = Router();

// ─── All cart routes require authentication ───────────────────
router.get("/",               requireAuth,                                  getMyCart);
router.post("/",              requireAuth, validate(addToCartSchema),       addItemToCart);
router.patch("/:product_id",  requireAuth, validate(updateCartItemSchema),  updateItem);
router.delete("/",            requireAuth,                                  clearMyCart);
router.delete("/:product_id", requireAuth,                                  removeItem);

export default router;