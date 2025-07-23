/**
 * Progress validation rules
 */
const { body } = require('express-validator');

/**
 * Update progress validation rules
 */
const updateProgressValidation = [
  body('moduleId')
    .notEmpty()
    .withMessage('Module ID is required'),
  
  body('activityId')
    .notEmpty()
    .withMessage('Activity ID is required'),
  
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed'])
    .withMessage('Status must be one of: not_started, in_progress, completed'),
  
  body('score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Score must be a non-negative integer'),
  
  body('userResponses')
    .optional()
    .isArray()
    .withMessage('User responses must be an array'),
];

/**
 * Get progress validation rules
 */
const getProgressValidation = [
  body('moduleId')
    .optional()
    .isString()
    .withMessage('Module ID must be a string'),
];

/**
 * Update time spent validation rules
 */
const updateTimeSpentValidation = [
  body('moduleId')
    .notEmpty()
    .withMessage('Module ID is required'),
  
  body('timeSpent')
    .notEmpty()
    .withMessage('Time spent is required')
    .isInt({ min: 1 })
    .withMessage('Time spent must be a positive integer'),
];

module.exports = {
  updateProgressValidation,
  getProgressValidation,
  updateTimeSpentValidation,
};