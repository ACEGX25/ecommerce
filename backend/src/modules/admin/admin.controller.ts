import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendSuccess, sendError } from "../../utils/response";
import { fetchAllOrders, fetchOrdersSummary } from "./admin.service";

// ─── GET /api/admin/orders ────────────────────────────────────
export async function getAllOrdersAdmin(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { status } = req.query as { status?: string };
    const orders = await fetchAllOrders(status);
    return sendSuccess(res, { orders });
  } catch (err) {
    console.error("[getAllOrdersAdmin]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── GET /api/admin/orders/summary ───────────────────────────
export async function getOrdersSummary(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const summary = await fetchOrdersSummary();
    return sendSuccess(res, { summary });
  } catch (err) {
    console.error("[getOrdersSummary]", err);
    return sendError(res, "Internal server error", 500);
  }
}