const express = require('express');
const router = express.Router();

// Import controllers
const { register, login, logout, getMe, changePassword, refreshTokens } = require('../controllers/auth.controller');

// Import validation middleware
const validate = require('../middleware/validate.middleware');
const { registerValidation, loginValidation, changePasswordValidation } = require('../validations/auth.validation');

// Import auth middleware
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/refresh-tokens', refreshTokens);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, validate(changePasswordValidation), changePassword);

module.exports = router;