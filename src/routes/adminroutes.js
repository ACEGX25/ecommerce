const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/admincontroller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly); // all routes: must be logged-in admin

router.get('/stats', getDashboardStats);  // GET /api/admin/stats
router.get('/users', getAllUsers);        // GET /api/admin/users

module.exports = router;