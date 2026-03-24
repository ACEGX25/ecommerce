import { db } from "../../config/db";

// ─── Get all orders (admin) ───────────────────────────────────
export async function fetchAllOrders(status?: string) {
  const res = status
    ? await db.query(
        `SELECT
            o.id, o.user_id, o.total_amount, o.status,
            o.shipping_address, o.created_at, o.updated_at,
            u.name  AS user_name,
            u.email AS user_email
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.status = $1
         ORDER BY o.id DESC`,
        [status]
      )
    : await db.query(
        `SELECT
            o.id, o.user_id, o.total_amount, o.status,
            o.shipping_address, o.created_at, o.updated_at,
            u.name  AS user_name,
            u.email AS user_email
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         ORDER BY o.id DESC`
      );

  return res.rows;
}

// ─── Orders summary by status ─────────────────────────────────
export async function fetchOrdersSummary() {
  const res = await db.query(
    `SELECT status, COUNT(*)::int AS count
     FROM orders
     GROUP BY status
     ORDER BY count DESC`
  );
  return res.rows;
}