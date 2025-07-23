/**
 * Progress Controller
 * Handles user progress tracking operations
 */
const progressService = require('../services/progress.service');
const logger = require('../utils/logger');

/**
 * Get user progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const moduleId = req.query.moduleId;
    
    // Get user progress
    const progress = await progressService.getUserProgress(userId);
    
    // If moduleId is provided, filter progress to only include that module
    const responseData = moduleId
      ? {
          ...progress.toObject(),
          modules: progress.modules.filter(m => m.moduleId === moduleId),
        }
      : progress;
    
    res.status(200).json({
      success: true,
      data: {
        progress: responseData,
      },
    });
  } catch (error) {
    logger.error('Error fetching user progress:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching user progress',
      error: error.message,
    });
  }
};

/**
 * Update user progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId, activityId, status, score, userResponses } = req.body;
    
    if (!moduleId || !activityId) {
      return res.status(400).json({
        success: false,
        message: 'Module ID and Activity ID are required',
      });
    }
    
    // Update activity progress
    const updateData = {};
    if (status) updateData.status = status;
    if (score !== undefined) updateData.score = score;
    if (userResponses) updateData.userResponses = userResponses;
    
    const result = await progressService.updateActivityProgress(
      userId,
      moduleId,
      activityId,
      updateData
    );
    
    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: result.progress,
        xp: result.xp,
        badge: result.badge,
      },
    });
  } catch (error) {
    logger.error('Error updating user progress:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating user progress',
      error: error.message,
    });
  }
};

/**
 * Get user statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user statistics
    const statistics = await progressService.getUserStatistics(userId);
    
    res.status(200).json({
      success: true,
      data: {
        statistics,
      },
    });
  } catch (error) {
    logger.error('Error fetching user statistics:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message,
    });
  }
};

/**
 * Update time spent on module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTimeSpent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { moduleId, timeSpent } = req.body;
    
    if (!moduleId || timeSpent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Module ID and time spent are required',
      });
    }
    
    // Update time spent
    const progress = await progressService.updateTimeSpent(userId, moduleId, timeSpent);
    
    res.status(200).json({
      success: true,
      message: 'Time spent updated successfully',
      data: {
        progress,
      },
    });
  } catch (error) {
    logger.error('Error updating time spent:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating time spent',
      error: error.message,
    });
  }
};

/**
 * Update user login streak
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateLoginStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Update login streak
    const result = await progressService.updateLoginStreak(userId);
    
    res.status(200).json({
      success: true,
      message: 'Login streak updated successfully',
      data: {
        streakData: result.streakData,
        xpEarned: result.xpEarned,
      },
    });
  } catch (error) {
    logger.error('Error updating login streak:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating login streak',
      error: error.message,
    });
  }
};

/**
 * Get user's weak areas
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getWeakAreas = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get weak areas
    const weakAreas = await progressService.identifyWeakAreas(userId);
    
    res.status(200).json({
      success: true,
      data: {
        weakAreas,
      },
    });
  } catch (error) {
    logger.error('Error identifying weak areas:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error identifying weak areas',
      error: error.message,
    });
  }
};

/**
 * Check certification eligibility
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkCertificationEligibility = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check certification eligibility
    const eligibility = await progressService.checkCertificationEligibility(userId);
    
    res.status(200).json({
      success: true,
      data: {
        eligibility,
      },
    });
  } catch (error) {
    logger.error('Error checking certification eligibility:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error checking certification eligibility',
      error: error.message,
    });
  }
};