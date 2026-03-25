import { db } from "../../config/db";
import { CreateOrderInput, Order, OrderWithItems } from "./orders.types";

// ─── Fetch helpers ────────────────────────────────────────────
export async function getOrderById(
  orderId: number
): Promise<OrderWithItems | null> {
  const orderRes = await db.query(
    `SELECT id, user_id, total_amount, status, shipping_address, created_at, updated_at
     FROM orders WHERE id = $1`,
    [orderId]
  );
  const order = orderRes.rows[0];
  if (!order) return null;

  const itemsRes = await db.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price_at_purchase,
            p.name AS product_name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return { ...order, items: itemsRes.rows };
}

export async function getOrdersByUser(userId: number): Promise<OrderWithItems[]> {
  const res = await db.query(
    `SELECT
        o.id, o.user_id, o.total_amount, o.status,
        o.shipping_address, o.created_at, o.updated_at,
        oi.id           AS item_id,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        p.name          AS product_name
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );

  // Group flat rows into orders with nested items array
  const ordersMap = new Map<number, OrderWithItems>();

  for (const row of res.rows) {
    if (!ordersMap.has(row.id)) {
      ordersMap.set(row.id, {
        id: row.id,
        user_id: row.user_id,
        total_amount: row.total_amount,
        status: row.status,
        shipping_address: row.shipping_address,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items: [],
      });
    }

    if (row.item_id) {
      ordersMap.get(row.id)!.items.push({
        id: row.item_id,
        order_id: row.id,
        product_id: row.product_id,
        quantity: row.quantity,
        price_at_purchase: row.price_at_purchase,
        product_name: row.product_name,
      });
    }
  }

  return Array.from(ordersMap.values());
}

export async function getAllOrders(
  status?: string
): Promise<Order[]> {
  const res = status
    ? await db.query(
        `SELECT id, user_id, total_amount, status, shipping_address, created_at, updated_at
         FROM orders WHERE status = $1 ORDER BY created_at DESC`,
        [status]
      )
    : await db.query(
        `SELECT id, user_id, total_amount, status, shipping_address, created_at, updated_at
         FROM orders ORDER BY created_at DESC`
      );
  return res.rows;
}

// ─── Create order ─────────────────────────────────────────────
export async function createOrder(
  userId: number,
  input: CreateOrderInput
): Promise<OrderWithItems> {
  // Fetch product prices and validate stock in one query
  const productIds = input.items.map((i) => i.product_id);
  const productRes = await db.query(
    `SELECT id, price, stock, name FROM products WHERE id = ANY($1::int[])`,
    [productIds]
  );

  const productMap = new Map(productRes.rows.map((p) => [p.id, p]));

  for (const item of input.items) {
    const product = productMap.get(item.product_id);
    if (!product) {
      throw new OrderError(`Product ${item.product_id} not found`, 404);
    }
    if (product.stock < item.quantity) {
      throw new OrderError(
        `Insufficient stock for "${product.name}"`,
        400
      );
    }
  }

  const totalAmount = input.items.reduce((sum, item) => {
    const price = productMap.get(item.product_id)!.price;
    return sum + price * item.quantity;
  }, 0);

  // Begin transaction
  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const orderRes = await client.query<Order>(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total_amount, status, shipping_address, created_at, updated_at`,
      [userId, totalAmount, input.shipping_address]
    );
    const order = orderRes.rows[0];

    const insertedItems: (OrderWithItems["items"][number])[] = [];

    for (const item of input.items) {
      const product = productMap.get(item.product_id)!;

      const itemRes = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)
         RETURNING id, order_id, product_id, quantity, price_at_purchase`,
        [order.id, item.product_id, item.quantity, product.price]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      insertedItems.push({ ...itemRes.rows[0], product_name: product.name });
    }

    await client.query("COMMIT");
    return { ...order, items: insertedItems };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ─── Update order status ──────────────────────────────────────
export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<Order | null> {
  const res = await db.query(
    `UPDATE orders SET status = $1
     WHERE id = $2
     RETURNING id, user_id, total_amount, status, shipping_address, created_at, updated_at`,
    [status, orderId]
  );
  return res.rows[0] ?? null;
}

export async function cancelOrder(
  orderId: number,
  userId: number
): Promise<Order | null> {
  // Only allow cancelling own pending orders
  const res = await db.query(
    `UPDATE orders SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2 AND status = 'pending'
     RETURNING id, user_id, total_amount, status, shipping_address, created_at, updated_at`,
    [orderId, userId]
  );
  return res.rows[0] ?? null;
}

// ─── Custom error ─────────────────────────────────────────────
export class OrderError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "OrderError";
  }
}