// src/controllers/adminController.js
// Admin-only dashboard data — stats, user management

const db = require('../config/db');

// GET /api/admin/stats  → dashboard overview
const getDashboardStats = async (req, res) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      db.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      db.query('SELECT COUNT(*) FROM products'),
      db.query('SELECT COUNT(*) FROM orders'),
      db.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'"),
    ]);

    // Recent orders
    const recentOrders = await db.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 5`
    );

    // Low stock products (stock < 5)
    const lowStock = await db.query(
      'SELECT id, name, stock FROM products WHERE stock < 5 ORDER BY stock ASC'
    );

    res.json({
      stats: {
        totalUsers: parseInt(users.rows[0].count),
        totalProducts: parseInt(products.rows[0].count),
        totalOrders: parseInt(orders.rows[0].count),
        totalRevenue: parseFloat(revenue.rows[0].total).toFixed(2),
      },
      recentOrders: recentOrders.rows,
      lowStockProducts: lowStock.rows,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/admin/users  → list all users
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getDashboardStats, getAllUsers };