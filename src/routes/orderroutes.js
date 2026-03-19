const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/ordercontroller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect); // all order routes need login

router.post('/', placeOrder);           // POST /api/orders
router.get('/', getOrders);             // GET /api/orders (admin=all, user=own)
router.get('/:id', getOrderById);       // GET /api/orders/7

// Admin only
router.patch('/:id/status', adminOnly, updateOrderStatus);  // PATCH /api/orders/7/status

module.exports = router;