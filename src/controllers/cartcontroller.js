// src/controllers/cartController.js
// Cart = temporary storage before placing an order
// Each user has their own cart. UNIQUE(user_id, product_id) in DB prevents duplicates.

const db = require('../config/db');

// GET /api/cart  → get logged-in user's cart
const getCart = async (req, res) => {
  try {
    // JOIN cart with products to get product details
    const result = await db.query(
      `SELECT c.id, c.quantity, c.added_at,
              p.id as product_id, p.name, p.price, p.image_url, p.stock, p.size, p.color,
              (c.quantity * p.price) as subtotal
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    const items = result.rows;
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({ items, total: total.toFixed(2), itemCount: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/cart  → add item to cart (or increase quantity if already in cart)
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required.' });
    }

    // Check product exists and has stock
    const product = await db.query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.rows[0].stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    // ON CONFLICT: if item already in cart, just add to quantity
    // This is a PostgreSQL UPSERT (INSERT ... ON CONFLICT DO UPDATE)
    const result = await db.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart.quantity + $3
       RETURNING *`,
      [req.user.id, product_id, quantity]
    );

    res.status(201).json({ message: 'Added to cart!', cartItem: result.rows[0] });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/cart/:cartItemId  → update quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cartItemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const result = await db.query(
      `UPDATE cart SET quantity = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, cartItemId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.json({ message: 'Cart updated!', cartItem: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/cart/:cartItemId  → remove one item
const removeFromCart = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.cartItemId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/cart  → clear entire cart
const clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };