// src/controllers/orderController.js
// Orders = converts cart items into a confirmed purchase
// Uses a DB TRANSACTION so if any step fails, all changes are rolled back
// (Like @Transactional in Spring Boot)

const db = require('../config/db');

// POST /api/orders  → place order from current cart (user)
const placeOrder = async (req, res) => {
  const { shipping_address } = req.body;

  if (!shipping_address) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  // Get a client from pool for manual transaction control
  const client = await require('../config/db').query('SELECT NOW()'); // warm up
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const pgClient = await pool.connect();

  try {
    // START TRANSACTION — like @Transactional in Spring
    await pgClient.query('BEGIN');

    // 1. Get user's cart
    const cartResult = await pgClient.query(
      `SELECT c.quantity, p.id as product_id, p.price, p.stock, p.name
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await pgClient.query('ROLLBACK');
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // 2. Validate stock for each item
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await pgClient.query('ROLLBACK');
        return res.status(400).json({
          message: `Insufficient stock for "${item.name}". Available: ${item.stock}`,
        });
      }
    }

    // 3. Calculate total
    const total = cartResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
    );

    // 4. Create order
    const orderResult = await pgClient.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status)
       VALUES ($1, $2, $3, 'confirmed') RETURNING *`,
      [req.user.id, total.toFixed(2), shipping_address]
    );

    const order = orderResult.rows[0];

    // 5. Insert order items + reduce stock
    for (const item of cartResult.rows) {
      await pgClient.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      // Decrease stock
      await pgClient.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 6. Clear cart
    await pgClient.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    // COMMIT — save everything
    await pgClient.query('COMMIT');

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    await pgClient.query('ROLLBACK'); // undo everything on error
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    pgClient.release(); // return connection to pool
    pool.end();
  }
};

// GET /api/orders  → user sees their orders, admin sees all orders
const getOrders = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      // Admin: see all orders with user info
      result = await db.query(
        `SELECT o.*, u.name as user_name, u.email as user_email
         FROM orders o JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
    } else {
      // User: only their own orders
      result = await db.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/orders/:id  → order details with items
const getOrderById = async (req, res) => {
  try {
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Security: users can only view their own orders
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Get order items with product details
    const itemsResult = await db.query(
      `SELECT oi.*, p.name, p.image_url, p.category, p.size, p.color
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );

    res.json({ ...order, items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// PATCH /api/orders/:id/status  → admin updates order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated!', order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus };