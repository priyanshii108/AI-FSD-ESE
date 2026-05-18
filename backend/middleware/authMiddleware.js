/**
 * @file authMiddleware.js
 * @description JWT authentication middleware for protecting routes
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: Validates JWT token and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found. Access denied.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized. Token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }
};

/**
 * Admin only route guard
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
  }
};

module.exports = { protect, adminOnly };
