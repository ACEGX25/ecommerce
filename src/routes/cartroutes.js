const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartcontroller');
const { protect } = require('../middleware/auth');

// All cart routes require login
router.use(protect); // applies protect to ALL routes below (like class-level @PreAuthorize)

router.get('/', getCart);                          // GET /api/cart
router.post('/', addToCart);                       // POST /api/cart
router.put('/:cartItemId', updateCartItem);        // PUT /api/cart/3
router.delete('/clear', clearCart);                // DELETE /api/cart/clear
router.delete('/:cartItemId', removeFromCart);     // DELETE /api/cart/3

module.exports = router;