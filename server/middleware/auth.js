const jwt = require('jsonwebtoken');

// Verifies the JWT sent in the Authorization header and attaches
// the decoded user payload (id, role) to req.user.
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, name, email }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
}

// Restricts a route to admin-role users only. Must run after protect().
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required for this action.' });
  }
  next();
}

module.exports = { protect, requireAdmin };
