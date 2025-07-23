/**
 * Module Controller
 * Handles module operations
 */
const moduleService = require('../services/module.service');
const logger = require('../utils/logger');

/**
 * Get all modules
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModules = async (req, res) => {
  try {
    // Get modules
    const modules = await moduleService.getModules(req.query);
    
    res.status(200).json({
      success: true,
      count: modules.length,
      data: {
        modules,
      },
    });
  } catch (error) {
    logger.error('Error fetching modules:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching modules',
      error: error.message,
    });
  }
};

/**
 * Get module by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getModuleById = async (req, res) => {
  try {
    // Get module
    const module = await moduleService.getModuleById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        module,
      },
    });
  } catch (error) {
    logger.error('Error fetching module:', { error: error.message });
    
    if (error.message === 'Module not found') {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching module',
      error: error.message,
    });
  }
};

/**
 * Create module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createModule = async (req, res) => {
  try {
    // Create module
    const module = await moduleService.createModule(req.body);
    
    res.status(201).json({
      success: true,
      data: {
        module,
      },
    });
  } catch (error) {
    logger.error('Error creating module:', { error: error.message });
    
    if (error.message.includes('Module with this ID already exists')) {
      return res.status(400).json({
        success: false,
        message: 'Module with this ID already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating module',
      error: error.message,
    });
  }
};

/**
 * Update module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateModule = async (req, res) => {
  try {
    // Update module
    const module = await moduleService.updateModule(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: {
        module,
      },
    });
  } catch (error) {
    logger.error('Error updating module:', { error: error.message });
    
    if (error.message === 'Module not found') {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating module',
      error: error.message,
    });
  }
};

/**
 * Delete module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteModule = async (req, res) => {
  try {
    // Delete module
    await moduleService.deleteModule(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error('Error deleting module:', { error: error.message });
    
    if (error.message === 'Module not found') {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }
    
    if (error.message.includes('Cannot delete module as it is a prerequisite')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting module',
      error: error.message,
    });
  }
};

/**
 * Check module prerequisites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkPrerequisites = async (req, res) => {
  try {
    const userId = req.user.id;
    const moduleId = req.params.id;
    
    // Check prerequisites
    const result = await moduleService.checkPrerequisites(userId, moduleId);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error checking prerequisites:', { error: error.message });
    
    if (error.message === 'Module not found') {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error checking prerequisites',
      error: error.message,
    });
  }
};

/**
 * Get available modules
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAvailableModules = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get available modules
    const modules = await moduleService.getAvailableModules(userId);
    
    res.status(200).json({
      success: true,
      count: modules.length,
      data: {
        modules,
      },
    });
  } catch (error) {
    logger.error('Error fetching available modules:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching available modules',
      error: error.message,
    });
  }
};

/**
 * Get next recommended module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getNextRecommendedModule = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get next recommended module
    const module = await moduleService.getNextRecommendedModule(userId);
    
    res.status(200).json({
      success: true,
      data: {
        module,
      },
    });
  } catch (error) {
    logger.error('Error fetching next recommended module:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching next recommended module',
      error: error.message,
    });
  }
};