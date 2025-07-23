const express = require('express');
const router = express.Router();

// Import controllers
const { 
  getProgress, 
  updateProgress, 
  getStatistics, 
  updateTimeSpent,
  updateLoginStreak,
  getWeakAreas,
  checkCertificationEligibility
} = require('../controllers/progress.controller');

// Import validation middleware
const validate = require('../middleware/validate.middleware');
const { 
  getProgressValidation, 
  updateProgressValidation,
  updateTimeSpentValidation
} = require('../validations/progress.validation');

// Import auth middleware
const { protect } = require('../middleware/auth.middleware');

// Routes
router.get('/', protect, validate(getProgressValidation), getProgress);
router.post('/', protect, validate(updateProgressValidation), updateProgress);
router.get('/statistics', protect, getStatistics);
router.post('/time-spent', protect, validate(updateTimeSpentValidation), updateTimeSpent);
router.post('/login-streak', protect, updateLoginStreak);
router.get('/weak-areas', protect, getWeakAreas);
router.get('/certification-eligibility', protect, checkCertificationEligibility);

module.exports = router;