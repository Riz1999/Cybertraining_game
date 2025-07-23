/**
 * Module validation rules
 */
const { body } = require('express-validator');

/**
 * Create module validation rules
 */
const createModuleValidation = [
  body('id')
    .notEmpty()
    .withMessage('Module ID is required')
    .isString()
    .withMessage('Module ID must be a string')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Module ID can only contain letters, numbers, hyphens, and underscores'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('objectives')
    .isArray()
    .withMessage('Objectives must be an array')
    .notEmpty()
    .withMessage('At least one objective is required'),
  
  body('objectives.*')
    .isString()
    .withMessage('Each objective must be a string'),
  
  body('prerequisites')
    .optional()
    .isObject()
    .withMessage('Prerequisites must be an object'),
  
  body('prerequisites.modules')
    .optional()
    .isArray()
    .withMessage('Prerequisite modules must be an array'),
  
  body('prerequisites.modules.*')
    .isString()
    .withMessage('Each prerequisite module must be a string'),
  
  body('prerequisites.xpLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('XP level must be a non-negative integer'),
  
  body('prerequisites.badges')
    .optional()
    .isArray()
    .withMessage('Prerequisite badges must be an array'),
  
  body('prerequisites.badges.*')
    .isString()
    .withMessage('Each prerequisite badge must be a string'),
  
  body('sequence')
    .optional()
    .isObject()
    .withMessage('Sequence must be an object'),
  
  body('sequence.order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sequence order must be a non-negative integer'),
  
  body('sequence.category')
    .optional()
    .isIn(['core', 'optional', 'advanced'])
    .withMessage('Sequence category must be one of: core, optional, advanced'),
  
  body('sequence.track')
    .optional()
    .isString()
    .withMessage('Sequence track must be a string'),
  
  body('sequence.isGated')
    .optional()
    .isBoolean()
    .withMessage('Sequence isGated must be a boolean'),
  
  body('activities')
    .isArray()
    .withMessage('Activities must be an array'),
  
  body('activities.*.id')
    .notEmpty()
    .withMessage('Activity ID is required')
    .isString()
    .withMessage('Activity ID must be a string'),
  
  body('activities.*.type')
    .notEmpty()
    .withMessage('Activity type is required')
    .isIn(['quiz', 'simulation', 'roleplay', 'dragdrop', 'interactive'])
    .withMessage('Activity type must be one of: quiz, simulation, roleplay, dragdrop, interactive'),
  
  body('activities.*.title')
    .notEmpty()
    .withMessage('Activity title is required')
    .isString()
    .withMessage('Activity title must be a string'),
  
  body('activities.*.content')
    .notEmpty()
    .withMessage('Activity content is required'),
  
  body('activities.*.points')
    .notEmpty()
    .withMessage('Activity points are required')
    .isInt({ min: 0 })
    .withMessage('Activity points must be a non-negative integer'),
  
  body('activities.*.timeLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Activity time limit must be a non-negative integer'),
  
  body('badgeReward')
    .notEmpty()
    .withMessage('Badge reward is required')
    .isObject()
    .withMessage('Badge reward must be an object'),
  
  body('badgeReward.id')
    .notEmpty()
    .withMessage('Badge ID is required')
    .isString()
    .withMessage('Badge ID must be a string'),
  
  body('badgeReward.name')
    .notEmpty()
    .withMessage('Badge name is required')
    .isString()
    .withMessage('Badge name must be a string'),
  
  body('badgeReward.description')
    .notEmpty()
    .withMessage('Badge description is required')
    .isString()
    .withMessage('Badge description must be a string'),
  
  body('badgeReward.imageUrl')
    .notEmpty()
    .withMessage('Badge image URL is required')
    .isString()
    .withMessage('Badge image URL must be a string'),
  
  body('minPassingScore')
    .notEmpty()
    .withMessage('Minimum passing score is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum passing score must be between 0 and 100'),
  
  body('estimatedDuration')
    .notEmpty()
    .withMessage('Estimated duration is required')
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  
  body('version')
    .optional()
    .isString()
    .withMessage('Version must be a string'),
  
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  
  body('metadata.difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be one of: beginner, intermediate, advanced'),
  
  body('metadata.tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('metadata.tags.*')
    .isString()
    .withMessage('Each tag must be a string'),
];

/**
 * Update module validation rules
 */
const updateModuleValidation = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('objectives')
    .optional()
    .isArray()
    .withMessage('Objectives must be an array')
    .notEmpty()
    .withMessage('At least one objective is required'),
  
  body('objectives.*')
    .isString()
    .withMessage('Each objective must be a string'),
  
  body('prerequisites')
    .optional()
    .isObject()
    .withMessage('Prerequisites must be an object'),
  
  body('prerequisites.modules')
    .optional()
    .isArray()
    .withMessage('Prerequisite modules must be an array'),
  
  body('prerequisites.modules.*')
    .isString()
    .withMessage('Each prerequisite module must be a string'),
  
  body('prerequisites.xpLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('XP level must be a non-negative integer'),
  
  body('prerequisites.badges')
    .optional()
    .isArray()
    .withMessage('Prerequisite badges must be an array'),
  
  body('prerequisites.badges.*')
    .isString()
    .withMessage('Each prerequisite badge must be a string'),
  
  body('sequence')
    .optional()
    .isObject()
    .withMessage('Sequence must be an object'),
  
  body('sequence.order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sequence order must be a non-negative integer'),
  
  body('sequence.category')
    .optional()
    .isIn(['core', 'optional', 'advanced'])
    .withMessage('Sequence category must be one of: core, optional, advanced'),
  
  body('sequence.track')
    .optional()
    .isString()
    .withMessage('Sequence track must be a string'),
  
  body('sequence.isGated')
    .optional()
    .isBoolean()
    .withMessage('Sequence isGated must be a boolean'),
  
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  
  body('activities.*.id')
    .notEmpty()
    .withMessage('Activity ID is required')
    .isString()
    .withMessage('Activity ID must be a string'),
  
  body('activities.*.type')
    .notEmpty()
    .withMessage('Activity type is required')
    .isIn(['quiz', 'simulation', 'roleplay', 'dragdrop', 'interactive'])
    .withMessage('Activity type must be one of: quiz, simulation, roleplay, dragdrop, interactive'),
  
  body('activities.*.title')
    .notEmpty()
    .withMessage('Activity title is required')
    .isString()
    .withMessage('Activity title must be a string'),
  
  body('activities.*.content')
    .notEmpty()
    .withMessage('Activity content is required'),
  
  body('activities.*.points')
    .notEmpty()
    .withMessage('Activity points are required')
    .isInt({ min: 0 })
    .withMessage('Activity points must be a non-negative integer'),
  
  body('activities.*.timeLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Activity time limit must be a non-negative integer'),
  
  body('badgeReward')
    .optional()
    .isObject()
    .withMessage('Badge reward must be an object'),
  
  body('badgeReward.id')
    .notEmpty()
    .withMessage('Badge ID is required')
    .isString()
    .withMessage('Badge ID must be a string'),
  
  body('badgeReward.name')
    .notEmpty()
    .withMessage('Badge name is required')
    .isString()
    .withMessage('Badge name must be a string'),
  
  body('badgeReward.description')
    .notEmpty()
    .withMessage('Badge description is required')
    .isString()
    .withMessage('Badge description must be a string'),
  
  body('badgeReward.imageUrl')
    .notEmpty()
    .withMessage('Badge image URL is required')
    .isString()
    .withMessage('Badge image URL must be a string'),
  
  body('minPassingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Minimum passing score must be between 0 and 100'),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be a positive integer'),
  
  body('version')
    .optional()
    .isString()
    .withMessage('Version must be a string'),
  
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  
  body('metadata.difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be one of: beginner, intermediate, advanced'),
  
  body('metadata.tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('metadata.tags.*')
    .isString()
    .withMessage('Each tag must be a string'),
];

module.exports = {
  createModuleValidation,
  updateModuleValidation
};