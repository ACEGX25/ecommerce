// src/controllers/productController.js
// Handles all product (clothing) CRUD operations
// Admin-only: create, update, delete
// Public: get all, get one (with optional filters)

const db = require('../config/db');

// GET /api/products  → public, anyone can view
// Supports query params: ?category=jeans&size=M&minPrice=100&maxPrice=500&page=1&limit=10
const getAllProducts = async (req, res) => {
  try {
    const { category, size, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Build dynamic WHERE clause (like Spring Specifications / CriteriaBuilder)
    let conditions = [];
    let values = [];
    let idx = 1; // PostgreSQL uses $1, $2 ... for params

    if (category) { conditions.push(`category = $${idx++}`); values.push(category); }
    if (size)     { conditions.push(`size = $${idx++}`);     values.push(size); }
    if (color)    { conditions.push(`color = $${idx++}`);    values.push(color); }
    if (minPrice) { conditions.push(`price >= $${idx++}`);   values.push(minPrice); }
    if (maxPrice) { conditions.push(`price <= $${idx++}`);   values.push(maxPrice); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Pagination
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const query = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    // Count total for pagination metadata
    const countResult = await db.query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      values.slice(0, -2) // exclude limit/offset from count query
    );

    const products = await db.query(query, values);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: products.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET /api/products/:id  → public
const getProductById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/products  → admin only
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, size, color, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const result = await db.query(
      `INSERT INTO products (name, description, price, stock, category, size, color, image_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, price, stock || 0, category, size, color, image_url, req.user.id]
    );

    res.status(201).json({
      message: 'Product created successfully!',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// PUT /api/products/:id  → admin only
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, size, color, image_url } = req.body;
    const { id } = req.params;

    // Check product exists
    const existing = await db.query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const result = await db.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, stock=$4, category=$5, size=$6, color=$7, image_url=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING *`,
      [name, description, price, stock, category, size, color, image_url, id]
    );

    res.json({ message: 'Product updated!', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /api/products/:id  → admin only
const deleteProduct = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };