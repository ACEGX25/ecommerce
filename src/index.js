// src/index.js  — Entry point (like SpringApplication.run() in Spring Boot)
// Express = lightweight web framework (like Spring MVC but no XML/annotations)

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ── MIDDLEWARE (global, runs on every request) ──────────────────────────────
app.use(cors());                    // allow cross-origin requests (for Next.js frontend later)
app.use(express.json());            // parse JSON request bodies (like @RequestBody in Spring)
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ───────────────────────────────────────────────────────────────────
// Mount routers at a base path (like @RequestMapping at class level in Spring)
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ecom API is running 🚀', timestamp: new Date() });
});

// ── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
// Like @ControllerAdvice / @ExceptionHandler in Spring
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong.' });
});

// ── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});