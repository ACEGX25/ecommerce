import pool from "../../config/db";
import {
  AddToCartInput,
  UpdateCartItemInput,
  Cart,
  CartItemWithProduct,
} from "./cart.types";

// ─── Cart Error ───────────────────────────────────────────────
export class CartError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "CartError";
  }
}

// ─── Get Cart ─────────────────────────────────────────────────
export async function getCart(user_id: number): Promise<Cart> {
  const result = await pool.query<CartItemWithProduct>(
    `SELECT
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        c.added_at,
        p.name      AS product_name,
        p.price,
        p.image_url,
        p.stock
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.added_at DESC`,
    [user_id]
  );

  const items = result.rows;
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
  const total_amount = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return { items, total_items, total_amount };
}

// ─── Add to Cart ──────────────────────────────────────────────
export async function addToCart(
  user_id: number,
  input: AddToCartInput
): Promise<CartItemWithProduct> {
  const { product_id, quantity } = input;

  const product = await pool.query(
    `SELECT id, stock FROM products WHERE id = $1`,
    [product_id]
  );

  if (product.rowCount === 0) {
    throw new CartError("Product not found", 404);
  }

  if (product.rows[0].stock < quantity) {
    throw new CartError("Insufficient stock", 400);
  }

  // Upsert — if already in cart, increment quantity
  await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
    [user_id, product_id, quantity]
  );

  const result = await pool.query<CartItemWithProduct>(
    `SELECT
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        c.added_at,
        p.name      AS product_name,
        p.price,
        p.image_url,
        p.stock
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1 AND c.product_id = $2`,
    [user_id, product_id]
  );

  return result.rows[0];
}

// ─── Update Cart Item ─────────────────────────────────────────
export async function updateCartItem(
  user_id: number,
  product_id: number,
  input: UpdateCartItemInput
): Promise<CartItemWithProduct> {
  const { quantity } = input;

  const product = await pool.query(
    `SELECT stock FROM products WHERE id = $1`,
    [product_id]
  );

  if (product.rowCount === 0) {
    throw new CartError("Product not found", 404);
  }

  if (product.rows[0].stock < quantity) {
    throw new CartError("Insufficient stock", 400);
  }

  const updated = await pool.query(
    `UPDATE cart SET quantity = $1
     WHERE user_id = $2 AND product_id = $3
     RETURNING *`,
    [quantity, user_id, product_id]
  );

  if (updated.rowCount === 0) {
    throw new CartError("Cart item not found", 404);
  }

  const result = await pool.query<CartItemWithProduct>(
    `SELECT
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        c.added_at,
        p.name      AS product_name,
        p.price,
        p.image_url,
        p.stock
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1 AND c.product_id = $2`,
    [user_id, product_id]
  );

  return result.rows[0];
}

// ─── Remove Cart Item ─────────────────────────────────────────
export async function removeCartItem(
  user_id: number,
  product_id: number
): Promise<void> {
  const result = await pool.query(
    `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
    [user_id, product_id]
  );

  if (result.rowCount === 0) {
    throw new CartError("Cart item not found", 404);
  }
}

// ─── Clear Cart ───────────────────────────────────────────────
export async function clearCart(user_id: number): Promise<void> {
  await pool.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);
}