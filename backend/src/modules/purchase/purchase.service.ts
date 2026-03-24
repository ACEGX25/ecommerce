import { db } from "../../config/db";
import { CreateOrderDto, UpdateOrderStatusDto } from "../types/purchase.types";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

const calculateTotals = (subtotal: number) => {
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + shippingCost + tax;
  return { shippingCost, tax, grandTotal };
};

export const createOrderService = async (data: CreateOrderDto, userId: number) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Calculate subtotal from items
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price_at_purchase * item.quantity,
      0
    );
    const { grandTotal } = calculateTotals(subtotal);

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES ($1, $2, 'pending', $3)
       RETURNING *`,
      [userId, grandTotal, data.shipping_address ?? null]
    );
    const order = orderResult.rows[0];

    // Create order items and deduct stock
    for (const item of data.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price_at_purchase]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getOrdersByUserService = async (userId: number) => {
  const result = await db.query(
    `SELECT o.*,
       json_agg(
         json_build_object(
           'id',                 oi.id,
           'product_id',         oi.product_id,
           'quantity',           oi.quantity,
           'price_at_purchase',  oi.price_at_purchase
         )
       ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getOrderByIdService = async (orderId: number, userId: number) => {
  const result = await db.query(
    `SELECT o.*,
       json_agg(
         json_build_object(
           'id',                oi.id,
           'product_id',        oi.product_id,
           'quantity',          oi.quantity,
           'price_at_purchase', oi.price_at_purchase
         )
       ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1 AND o.user_id = $2
     GROUP BY o.id`,
    [orderId, userId]
  );
  return result.rows[0] || null;
};

export const getAllOrdersService = async () => {
  const result = await db.query(
    `SELECT o.*,
       json_agg(
         json_build_object(
           'id',                oi.id,
           'product_id',        oi.product_id,
           'quantity',          oi.quantity,
           'price_at_purchase', oi.price_at_purchase
         )
       ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     GROUP BY o.id
     ORDER BY o.created_at DESC`
  );
  return result.rows;
};

export const updateOrderStatusService = async (
  orderId: number,
  data: UpdateOrderStatusDto
) => {
  const result = await db.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [data.status, orderId]
  );
  return result.rows[0] || null;
};

export const deleteOrderService = async (orderId: number) => {
  await db.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
};