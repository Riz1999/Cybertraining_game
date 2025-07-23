const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAllBadges,
  getBadgeById,
  getUserBadges,
  awardBadge,
  checkBadgeEligibility
} = require('../controllers/badge.controller');

// @route   GET /api/badges
// @desc    Get all available badges
// @access  Private
router.get('/', protect, getAllBadges);

// @route   GET /api/badges/user
// @desc    Get user's earned badges
// @access  Private
router.get('/user', protect, getUserBadges);

// @route   GET /api/badges/:id
// @desc    Get badge by ID
// @access  Private
router.get('/:id', protect, getBadgeById);

// @route   POST /api/badges/award
// @desc    Award a badge to user
// @access  Private
router.post('/award', protect, awardBadge);

// @route   POST /api/badges/check-eligibility
// @desc    Check if user is eligible for a badge
// @access  Private
router.post('/check-eligibility', protect, checkBadgeEligibility);

module.exports = router;