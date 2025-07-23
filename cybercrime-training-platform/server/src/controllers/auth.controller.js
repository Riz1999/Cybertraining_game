/**
 * Authentication Controller
 * Handles user registration, login, and logout functionality
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Import token service
 */
const tokenService = require('../services/token.service');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      department,
      role: 'trainee', // Default role for new users
    });

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    // Return user data and tokens
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        tokens,
      },
    });
  } catch (error) {
    logger.error('Registration error:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    // Return user data and tokens
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          badgesEarned: user.badgesEarned,
        },
        tokens,
      },
    });
  } catch (error) {
    logger.error('Login error:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * Logout a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logout = async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    
    // Blacklist token
    await tokenService.blacklistToken(token);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};

/**
 * Refresh tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }
    
    // Generate new tokens
    const tokens = await tokenService.refreshAuthTokens(refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        tokens,
      },
    });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message });
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMe = async (req, res) => {
  try {
    // User is already available in req.user from the protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          badgesEarned: user.badgesEarned,
        },
      },
    });
  } catch (error) {
    logger.error('Get profile error:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message,
    });
  }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    logger.error('Change password error:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};