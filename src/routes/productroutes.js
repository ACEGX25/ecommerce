const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
} = require('../controllers/productcontroller');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);        // GET /api/products
router.get('/:id', getProductById);    // GET /api/products/5

// Admin-only routes
// protect runs first (checks token), then adminOnly (checks role)
// Like a chain of Spring Security filters
router.post('/', protect, adminOnly, createProduct);       // POST /api/products
router.put('/:id', protect, adminOnly, updateProduct);     // PUT /api/products/5
router.delete('/:id', protect, adminOnly, deleteProduct);  // DELETE /api/products/5

module.exports = router;