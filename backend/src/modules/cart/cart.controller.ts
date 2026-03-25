import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  CartError,
} from "./cart.service";

// ─── GET /api/cart ────────────────────────────────────────────
export async function getMyCart(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const cart = await getCart(Number(req.user!.userId));
    return sendSuccess(res, { cart });
  } catch (err) {
    console.error("[getMyCart]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/cart ───────────────────────────────────────────
export async function addItemToCart(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const item = await addToCart(Number(req.user!.userId), req.body);
    return sendSuccess(res, { message: "Item added to cart", item }, 201);
  } catch (err) {
    if (err instanceof CartError) {
      return sendError(res, err.message, err.statusCode);
    }
    console.error("[addItemToCart]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── PATCH /api/cart/:product_id ──────────────────────────────
export async function updateItem(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const product_id = Number(req.params.product_id);
    if (isNaN(product_id)) return sendError(res, "Invalid product ID", 400);

    const item = await updateCartItem(
      Number(req.user!.userId),
      product_id,
      req.body
    );
    return sendSuccess(res, { message: "Cart item updated", item });
  } catch (err) {
    if (err instanceof CartError) {
      return sendError(res, err.message, err.statusCode);
    }
    console.error("[updateItem]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── DELETE /api/cart/:product_id ─────────────────────────────
export async function removeItem(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const product_id = Number(req.params.product_id);
    if (isNaN(product_id)) return sendError(res, "Invalid product ID", 400);

    await removeCartItem(Number(req.user!.userId), product_id);
    return sendSuccess(res, { message: "Item removed from cart" });
  } catch (err) {
    if (err instanceof CartError) {
      return sendError(res, err.message, err.statusCode);
    }
    console.error("[removeItem]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── DELETE /api/cart ─────────────────────────────────────────
export async function clearMyCart(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    await clearCart(Number(req.user!.userId));
    return sendSuccess(res, { message: "Cart cleared" });
  } catch (err) {
    console.error("[clearMyCart]", err);
    return sendError(res, "Internal server error", 500);
  }
}