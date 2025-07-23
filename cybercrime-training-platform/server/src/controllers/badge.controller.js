const Badge = require('../models/Badge');
const User = require('../models/User');
const Module = require('../models/Module');
const Progress = require('../models/Progress');
const badgeService = require('../services/badge.service');

/**
 * @desc    Get all available badges
 * @route   GET /api/badges
 * @access  Private
 */
const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: badges.length,
      data: {
        badges
      }
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching badges'
    });
  }
};

/**
 * @desc    Get badge by ID
 * @route   GET /api/badges/:id
 * @access  Private
 */
const getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findOne({ id: req.params.id });
    
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        badge
      }
    });
  } catch (error) {
    console.error('Error fetching badge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching badge'
    });
  }
};

/**
 * @desc    Get user's earned badges
 * @route   GET /api/badges/user
 * @access  Private
 */
const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('badgesEarned');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.badgesEarned.length,
      data: {
        badges: user.badgesEarned
      }
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user badges'
    });
  }
};

/**
 * @desc    Award a badge to user
 * @route   POST /api/badges/award
 * @access  Private
 */
const awardBadge = async (req, res) => {
  try {
    const { badgeId, moduleId, context = {} } = req.body;
    
    // Validate required fields
    if (!badgeId) {
      return res.status(400).json({
        success: false,
        message: 'Badge ID is required'
      });
    }
    
    // Use badge service to award badge
    const result = await badgeService.awardBadgeToUser(req.user.id, badgeId, context);
    
    res.status(200).json({
      success: true,
      message: 'Badge awarded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error awarding badge:', error);
    
    // Handle specific error cases
    if (error.message === 'User already has this badge') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Badge definition not found' || error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while awarding badge'
    });
  }
};

/**
 * @desc    Check if user is eligible for a badge
 * @route   POST /api/badges/check-eligibility
 * @access  Private
 */
const checkBadgeEligibility = async (req, res) => {
  try {
    const { moduleId, moduleProgress } = req.body;
    
    // Use badge service to check eligibility
    const result = await badgeService.checkBadgeEligibility(req.user.id, moduleId, moduleProgress);
    
    res.status(200).json({
      success: true,
      data: {
        eligible: result.eligible,
        badgeId: result.badgeId || null,
        reason: result.reason || '',
        badgeDefinition: result.badgeDefinition || null
      }
    });
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking badge eligibility'
    });
  }
};

module.exports = {
  getAllBadges,
  getBadgeById,
  getUserBadges,
  awardBadge,
  checkBadgeEligibility
};