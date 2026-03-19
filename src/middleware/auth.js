// src/middleware/auth.js
// Middleware in Express = like @Component filters in Spring Security
// It runs BEFORE your controller method on every protected route

const jwt = require('jsonwebtoken');

// protect: checks if user has a valid JWT token
// Like Spring's @PreAuthorize or SecurityFilterChain
const protect = (req, res, next) => {
  // Token comes in header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please login.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify signature + decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request (like SecurityContextHolder)
    next();             // call next() = proceed to the actual controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// adminOnly: runs AFTER protect, checks if role is admin
// Like @PreAuthorize("hasRole('ADMIN')") in Spring
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { protect, adminOnly };