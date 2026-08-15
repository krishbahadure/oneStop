// JWT Authentication Middleware
// Verifies Bearer token and attaches user to req.user

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'onestop_prototype_secret_jk_2024';

/**
 * requireAuth – verifies JWT and attaches decoded user to req.user
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

/**
 * requireAdmin – must be used AFTER requireAuth
 * Blocks access if the logged-in user is not an admin.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
