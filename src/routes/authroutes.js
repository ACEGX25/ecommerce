// src/routes/authRoutes.js
// Routes = like @RequestMapping in Spring
// express.Router() groups related routes (like a Controller class)

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authcontroller');
const { protect } = require('../middleware/auth');

// Public routes (no token needed)
router.post('/register', register);   // POST /api/auth/register
router.post('/login', login);         // POST /api/auth/login

// Protected route (token required)
router.get('/me', protect, getMe);    // GET /api/auth/me

module.exports = router;