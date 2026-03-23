// src/modules/orders/orders.controller.ts

import { Request, Response, NextFunction } from 'express';
import '../../modules/middleware/auth.middleware';
import pool from '../../config/db';
import {
  CreateOrderBody,
  UpdateOrderStatusBody,
  CancelOrderBody,
  CartItemRow,
} from "./orders.types";

const VALID_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'] as const;

// ─────────────────────────────────────────────────────────────
// USER — GET /api/orders
// My orders with pagination
// ─────────────────────────────────────────────────────────────
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId         = req.user!.id;
    const page           = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit          = Math.min(50, parseInt(req.query.limit as string) || 10);
    const offset         = (page - 1) * limit;
    const { status }     = req.query;

    const conditions: string[] = ['o.user_id = $1'];
    const values: unknown[]    = [userId];
    let   idx                  = 2;

    if (status && VALID_STATUSES.includes(status as any)) {
      conditions.push(`o.status = $${idx++}`);
      values.push(status);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT
           o.id, o.order_number, o.status, o.total_amount,
           o.currency, o.created_at, o.updated_at,
           COUNT(oi.id)::int AS item_count
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
         ${where}
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM orders o ${where}`,
        values
      ),
    ]);

    res.json({
      success: true,
      data:    dataRes.rows,
      meta: {
        total: Number(countRes.rows[0].count),
        page,
        limit,
        total_pages: Math.ceil(Number(countRes.rows[0].count) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// USER — GET /api/orders/:id
// Full order detail — users only see their own, admins see all
// ─────────────────────────────────────────────────────────────
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = rows[0];

    // non-admins can only see their own orders
    if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const [itemsRes, paymentRes, shipmentRes] = await Promise.all([
      pool.query('SELECT * FROM order_items  WHERE order_id = $1', [id]),
      pool.query(
        'SELECT * FROM payments  WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
        [id]
      ),
      pool.query(
        'SELECT * FROM shipments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
        [id]
      ),
    ]);

    res.json({
      success: true,
      data: {
        ...order,
        items:    itemsRes.rows,
        payment:  paymentRes.rows[0]  ?? null,
        shipment: shipmentRes.rows[0] ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// USER — POST /api/orders
// Create order from cart (full transaction)
// ─────────────────────────────────────────────────────────────
export const createOrder = async (
  req: Request<{}, {}, CreateOrderBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const client = await pool.connect();

  try {
    const userId = req.user!.id;
    const { shipping_address, billing_address, payment_method, coupon_code, notes } = req.body;

    if (!shipping_address) {
      res.status(400).json({ success: false, message: 'shipping_address is required' });
      return;
    }
    if (!payment_method) {
      res.status(400).json({ success: false, message: 'payment_method is required' });
      return;
    }

    await client.query('BEGIN');

    // ── 1. Fetch cart ──────────────────────────────────────────
    const cartRes = await client.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );
    if (!cartRes.rows.length) {
      await client.query('ROLLBACK');
      res.status(400).json({ success: false, message: 'Your cart is empty' });
      return;
    }
    const cartId = cartRes.rows[0].id;

    // ── 2. Fetch cart items with product/variant info ──────────
    const cartItemsRes = await client.query<CartItemRow>(
      `SELECT
         ci.cart_id, ci.product_id, ci.variant_id, ci.quantity, ci.unit_price,
         p.name          AS product_name,
         p.stock_quantity,
         p.tax_rate,
         p.is_active,
         p.sku,
         v.name          AS variant_name,
         v.stock_quantity AS variant_stock,
         (SELECT url FROM product_images
          WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) AS image_url
       FROM cart_items ci
       JOIN products p         ON p.id = ci.product_id
       LEFT JOIN product_variants v ON v.id = ci.variant_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (!cartItemsRes.rows.length) {
      await client.query('ROLLBACK');
      res.status(400).json({ success: false, message: 'Your cart is empty' });
      return;
    }

    // ── 3. Validate stock for every item ──────────────────────
    for (const item of cartItemsRes.rows) {
      if (!item.is_active) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: `"${item.product_name}" is no longer available` });
        return;
      }
      const available = item.variant_id ? (item.variant_stock ?? 0) : item.stock_quantity;
      if (available < item.quantity) {
        await client.query('ROLLBACK');
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product_name}" — only ${available} left`,
        });
        return;
      }
    }

    // ── 4. Calculate subtotal ─────────────────────────────────
    let subtotal = cartItemsRes.rows.reduce(
      (sum, i) => sum + Number(i.unit_price) * i.quantity,
      0
    );

    // ── 5. Apply coupon (if provided) ─────────────────────────
    let discount_amount  = 0;
    let resolved_coupon_id: string | null  = null;
    let resolved_coupon_code: string | null = null;

    if (coupon_code) {
      const couponRes = await client.query(
        `SELECT * FROM coupons
         WHERE code = $1
           AND is_active = TRUE
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (expires_at IS NULL OR expires_at >= NOW())`,
        [coupon_code.toUpperCase()]
      );

      if (!couponRes.rows.length) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
        return;
      }

      const coupon = couponRes.rows[0];

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        return;
      }

      if (subtotal < Number(coupon.min_order_amount)) {
        await client.query('ROLLBACK');
        res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.min_order_amount}`,
        });
        return;
      }

      // per-user usage check
      const usageRes = await client.query(
        `SELECT COUNT(*) FROM orders WHERE user_id = $1 AND coupon_code = $2`,
        [userId, coupon.code]
      );
      if (Number(usageRes.rows[0].count) >= coupon.per_user_limit) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: 'You have already used this coupon' });
        return;
      }

      discount_amount =
        coupon.discount_type === 'percentage'
          ? (subtotal * Number(coupon.discount_value)) / 100
          : Number(coupon.discount_value);

      if (coupon.max_discount_amount) {
        discount_amount = Math.min(discount_amount, Number(coupon.max_discount_amount));
      }

      resolved_coupon_id   = coupon.id;
      resolved_coupon_code = coupon.code;

      await client.query(
        'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
        [coupon.id]
      );
    }

    // ── 6. Tax & shipping ─────────────────────────────────────
    const tax_amount = cartItemsRes.rows.reduce(
      (sum, i) => sum + (Number(i.unit_price) * i.quantity * Number(i.tax_rate)) / 100,
      0
    );
    const shipping_amount = 0; // plug your shipping logic here
    const total_amount    = subtotal - discount_amount + tax_amount + shipping_amount;

    // ── 7. Insert order ───────────────────────────────────────
    const orderRes = await client.query(
      `INSERT INTO orders
         (user_id, status, subtotal, discount_amount, tax_amount,
          shipping_amount, total_amount, currency,
          coupon_id, coupon_code,
          shipping_address, billing_address, notes)
       VALUES ($1,'pending',$2,$3,$4,$5,$6,'INR',$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        userId,
        subtotal.toFixed(2),
        discount_amount.toFixed(2),
        tax_amount.toFixed(2),
        shipping_amount.toFixed(2),
        total_amount.toFixed(2),
        resolved_coupon_id,
        resolved_coupon_code,
        JSON.stringify(shipping_address),
        billing_address ? JSON.stringify(billing_address) : null,
        notes ?? null,
      ]
    );
    const order = orderRes.rows[0];

    // ── 8. Insert order items + decrement stock ───────────────
    for (const item of cartItemsRes.rows) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, variant_id, product_name, variant_name,
            sku, quantity, unit_price, total_price, tax_rate, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          order.id,
          item.product_id,
          item.variant_id ?? null,
          item.product_name,
          item.variant_name ?? null,
          item.sku ?? null,
          item.quantity,
          item.unit_price,
          (Number(item.unit_price) * item.quantity).toFixed(2),
          item.tax_rate,
          item.image_url ?? null,
        ]
      );

      // decrement stock on variant or product
      if (item.variant_id) {
        await client.query(
          'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
      } else {
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
    }

    // ── 9. Create pending payment record ─────────────────────
    const paymentRes = await client.query(
      `INSERT INTO payments (order_id, payment_method, amount, currency, status)
       VALUES ($1,$2,$3,'INR','pending') RETURNING *`,
      [order.id, payment_method, total_amount.toFixed(2)]
    );

    // ── 10. Clear cart ────────────────────────────────────────
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order,
        payment: paymentRes.rows[0],
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// ─────────────────────────────────────────────────────────────
// USER — PATCH /api/orders/:id/cancel
// ─────────────────────────────────────────────────────────────
export const cancelOrder = async (
  req: Request<{ id: string }, {}, CancelOrderBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id }     = req.params;
    const { reason } = req.body;

    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!rows.length) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = rows[0];

    if (req.user!.role !== 'admin' && order.user_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status "${order.status}"`,
      });
      return;
    }

    const updated = await pool.query(
      `UPDATE orders
       SET status = 'cancelled', cancelled_reason = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [reason ?? null, id]
    );

    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN — PATCH /api/admin/orders/:id/status
// ─────────────────────────────────────────────────────────────
export const updateOrderStatus = async (
  req: Request<{ id: string }, {}, UpdateOrderStatusBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (!rows.length) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN — GET /api/admin/orders
// All orders with filters + pagination
// ─────────────────────────────────────────────────────────────
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit  = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;
    const { status, user_id, search } = req.query;

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   idx                  = 1;

    if (status && VALID_STATUSES.includes(status as any)) {
      conditions.push(`o.status = $${idx++}`);
      values.push(status);
    }
    if (user_id) {
      conditions.push(`o.user_id = $${idx++}`);
      values.push(user_id);
    }
    if (search) {
      conditions.push(`(o.order_number ILIKE $${idx++} OR u.email ILIKE $${idx++})`);
      values.push(`%${search}%`, `%${search}%`);
      idx++; // we pushed 2 values above but only incremented once inside the push
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT
           o.id, o.order_number, o.status,
           o.total_amount, o.currency,
           o.created_at, o.updated_at,
           u.name  AS user_name,
           u.email AS user_email,
           COUNT(oi.id)::int AS item_count
         FROM orders o
         LEFT JOIN users       u  ON u.id  = o.user_id
         LEFT JOIN order_items oi ON oi.order_id = o.id
         ${where}
         GROUP BY o.id, u.name, u.email
         ORDER BY o.created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(DISTINCT o.id)
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         ${where}`,
        values
      ),
    ]);

    res.json({
      success: true,
      data:    dataRes.rows,
      meta: {
        total:       Number(countRes.rows[0].count),
        page,
        limit,
        total_pages: Math.ceil(Number(countRes.rows[0].count) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// ADMIN — GET /api/admin/orders/:id
// Full order detail for admin
// ─────────────────────────────────────────────────────────────
export const getOrderByIdAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       WHERE o.id = $1`,
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const [itemsRes, paymentRes, shipmentRes] = await Promise.all([
      pool.query('SELECT * FROM order_items  WHERE order_id = $1', [id]),
      pool.query('SELECT * FROM payments     WHERE order_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM shipments    WHERE order_id = $1 ORDER BY created_at DESC', [id]),
    ]);

    res.json({
      success: true,
      data: {
        ...rows[0],
        items:     itemsRes.rows,
        payments:  paymentRes.rows,
        shipments: shipmentRes.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};