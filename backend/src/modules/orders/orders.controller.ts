import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  OrderError,
} from "./orders.service";
import db from "../../config/db"; 

// ─── GET /api/orders — user's own orders ──────────────────────
export async function listMyOrders(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const orders = await getOrdersByUser(Number(req.user!.userId));
    return sendSuccess(res, { orders });
  } catch (err) {
    console.error("[listMyOrders]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── GET /api/orders/:id — get one order ──────────────────────
export async function getOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) return sendError(res, "Invalid order ID", 400);

    const order = await getOrderById(orderId);
    if (!order) return sendError(res, "Order not found", 404);

    // Users can only view their own orders; admins see all
    if (
      req.user!.role !== "admin" &&
      order.user_id !== Number(req.user!.userId)
    ) {
      return sendError(res, "Forbidden", 403);
    }

    return sendSuccess(res, { order });
  } catch (err) {
    console.error("[getOrder]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/orders — place an order ────────────────────────
export async function placeOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const order = await createOrder(Number(req.user!.userId), req.body);
    return sendSuccess(res, { message: "Order placed successfully", order }, 201);
  } catch (err) {
    if (err instanceof OrderError) {
      return sendError(res, err.message, err.statusCode);
    }
    console.error("[placeOrder]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── POST /api/orders/:id/cancel — cancel own order ──────────
export async function cancelMyOrder(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) return sendError(res, "Invalid order ID", 400);

    const order = await cancelOrder(orderId, Number(req.user!.userId));
    if (!order) {
      return sendError(res, "Order not found or cannot be cancelled", 400);
    }

    return sendSuccess(res, { message: "Order cancelled", order });
  } catch (err) {
    console.error("[cancelMyOrder]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── Admin: GET /api/admin/orders ─────────────────────────────
export async function adminListOrders(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { status } = req.query as { status?: string };
    const orders = await getAllOrders(status);
    return sendSuccess(res, { orders });
  } catch (err) {
    console.error("[adminListOrders]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// ─── Admin: PATCH /api/admin/orders/:id/status ────────────────
export async function adminUpdateStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) return sendError(res, "Invalid order ID", 400);

    const { status } = req.body;
    const order = await updateOrderStatus(orderId, status);
    if (!order) return sendError(res, "Order not found", 404);

    return sendSuccess(res, { message: "Order status updated", order });
  } catch (err) {
    console.error("[adminUpdateStatus]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// export async function getAllOrdersAdmin(req: Request, res: Response) {
//   try {
//     const result = await db.query(
//       `SELECT id, user_id, total_amount, status, shipping_address, created_at, updated_at
//        FROM public.orders
//        ORDER BY id DESC`
//     );
//     return res.json(result.rows);
//   } catch (err: any) {
//     console.error("[orders] fetch error:", err);
//     return res.status(500).json({ error: "Failed to fetch orders" });
//   }
// }

// export async function getOrdersSummary(req: Request, res: Response) {
//   try {
//     const result = await db.query(
//       `SELECT status, COUNT(*)::int AS count
//        FROM public.orders
//        GROUP BY status
//        ORDER BY count DESC`
//     );
//     // e.g. [{ status: "delivered", count: 4 }, ...]
//     return res.json(result.rows);
//   } catch (err: any) {
//     console.error("[orders] summary error:", err);
//     return res.status(500).json({ error: "Failed to fetch summary" });
//   }
// }