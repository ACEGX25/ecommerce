// backend/src/modules/orders/orders.controller.ts
import { Request, Response } from "express";
import db from "../../config/db"; 

/**
 * GET /api/orders
 * Returns all orders ordered by id DESC
 */
export async function getAllOrders(req: Request, res: Response) {
  try {
    const result = await db.query(
      `SELECT id, user_id, total_amount, status, shipping_address, created_at, updated_at
       FROM public.orders
       ORDER BY id DESC`
    );
    return res.json(result.rows);
  } catch (err: any) {
    console.error("[orders] fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

/**
 * GET /api/orders/summary
 * Returns a count per status — useful if you ever want a dedicated endpoint
 */
export async function getOrdersSummary(req: Request, res: Response) {
  try {
    const result = await db.query(
      `SELECT status, COUNT(*)::int AS count
       FROM public.orders
       GROUP BY status
       ORDER BY count DESC`
    );
    // e.g. [{ status: "delivered", count: 4 }, ...]
    return res.json(result.rows);
  } catch (err: any) {
    console.error("[orders] summary error:", err);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
}
