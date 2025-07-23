const express = require('express');
const router = express.Router();

// Import controllers
const {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  checkPrerequisites,
  getAvailableModules,
  getNextRecommendedModule
} = require('../controllers/module.controller');

// Import validation middleware
const validate = require('../middleware/validate.middleware');
const {
  createModuleValidation,
  updateModuleValidation
} = require('../validations/module.validation');

// Import auth middleware
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getModules);
router.get('/:id', getModuleById);

// Protected routes (require authentication)
router.get('/user/available', protect, getAvailableModules);
router.get('/user/recommended', protect, getNextRecommendedModule);
router.get('/:id/prerequisites', protect, checkPrerequisites);

// Admin routes (require admin role)
router.post('/', protect, authorize('admin'), validate(createModuleValidation), createModule);
router.put('/:id', protect, authorize('admin'), validate(updateModuleValidation), updateModule);
router.delete('/:id', protect, authorize('admin'), deleteModule);

module.exports = router;