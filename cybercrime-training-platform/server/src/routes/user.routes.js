const express = require('express');
const router = express.Router();

// Import controllers
const { getProfile, updateProfile, uploadProfileImage, updatePreferences } = require('../controllers/user.controller');

// Import validation middleware
const validate = require('../middleware/validate.middleware');
const { updateProfileValidation, updatePreferencesValidation } = require('../validations/user.validation');

// Import auth middleware
const { protect } = require('../middleware/auth.middleware');

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);
router.post('/profile/image', protect, uploadProfileImage);
router.put('/preferences', protect, validate(updatePreferencesValidation), updatePreferences);

module.exports = router;