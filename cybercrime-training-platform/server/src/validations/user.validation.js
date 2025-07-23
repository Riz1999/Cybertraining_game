/**
 * User validation rules
 */
const { body } = require('express-validator');

/**
 * Update profile validation rules
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('department')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  
  body('designation')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Designation must be between 2 and 100 characters'),
  
  body('rank')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Rank must be between 2 and 50 characters'),
  
  body('phoneNumber')
    .optional()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  
  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
];

/**
 * Change password validation rules
 */
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * Update preferences validation rules
 */
const updatePreferencesValidation = [
  body('preferences')
    .notEmpty()
    .withMessage('Preferences are required')
    .isObject()
    .withMessage('Preferences must be an object'),
  
  body('preferences.notifications')
    .optional()
    .isObject()
    .withMessage('Notifications must be an object'),
  
  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification must be a boolean'),
  
  body('preferences.notifications.inApp')
    .optional()
    .isBoolean()
    .withMessage('In-app notification must be a boolean'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be one of: light, dark, system'),
  
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as'])
    .withMessage('Language must be a valid language code'),
];

module.exports = {
  updateProfileValidation,
  changePasswordValidation,
  updatePreferencesValidation,
};