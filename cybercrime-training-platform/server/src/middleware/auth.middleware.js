/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const logger = require('../utils/logger');
const tokenService = require('../services/token.service');

/**
 * Protect routes that require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
    
    // Get token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if token is blacklisted
    const isBlacklisted = await tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated',
      });
    }
    
    // Get user from token
    const user = await User.findById(decoded.sub || decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Add user to request
    req.user = {
      id: user._id,
      role: user.role,
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', { error: error.message });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message,
    });
  }
};

/**
 * Restrict routes to specific roles
 * @param  {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    
    next();
  };
};