/**
 * Module Service
 * Handles module operations, sequencing, and prerequisite checking
 */
const Module = require('../models/Module');
const Activity = require('../models/Activity');
const Progress = require('../models/Progress');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Get all modules
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} Array of modules
 */
const getModules = async (query = {}) => {
  try {
    // Build filter object
    const filter = {};
    
    // Filter by published status if specified
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === 'true';
    }
    
    // Filter by category if specified
    if (query.category) {
      filter['sequence.category'] = query.category;
    }
    
    // Filter by track if specified
    if (query.track) {
      filter['sequence.track'] = query.track;
    }
    
    // Filter by difficulty if specified
    if (query.difficulty) {
      filter['metadata.difficulty'] = query.difficulty;
    }
    
    // Filter by tags if specified
    if (query.tags) {
      const tags = query.tags.split(',');
      filter['metadata.tags'] = { $in: tags };
    }
    
    // Get modules
    const modules = await Module.find(filter).sort({ 'sequence.order': 1 });
    
    return modules;
  } catch (error) {
    logger.error('Error getting modules:', { error: error.message });
    throw new Error('Error getting modules');
  }
};

/**
 * Get module by ID
 * @param {string} id - Module ID
 * @returns {Promise<Object>} Module
 */
const getModuleById = async (id) => {
  try {
    const module = await Module.findOne({ id });
    
    if (!module) {
      throw new Error('Module not found');
    }
    
    return module;
  } catch (error) {
    logger.error('Error getting module by ID:', { error: error.message });
    throw new Error('Error getting module by ID');
  }
};

/**
 * Create module
 * @param {Object} moduleData - Module data
 * @returns {Promise<Object>} Created module
 */
const createModule = async (moduleData) => {
  try {
    // Check if module with same ID already exists
    const existingModule = await Module.findOne({ id: moduleData.id });
    
    if (existingModule) {
      throw new Error('Module with this ID already exists');
    }
    
    // Create module
    const module = await Module.create(moduleData);
    
    return module;
  } catch (error) {
    logger.error('Error creating module:', { error: error.message });
    throw new Error(`Error creating module: ${error.message}`);
  }
};

/**
 * Update module
 * @param {string} id - Module ID
 * @param {Object} moduleData - Module data
 * @returns {Promise<Object>} Updated module
 */
const updateModule = async (id, moduleData) => {
  try {
    // Find module
    const module = await Module.findOne({ id });
    
    if (!module) {
      throw new Error('Module not found');
    }
    
    // Update module
    Object.assign(module, moduleData);
    
    // Save module
    await module.save();
    
    return module;
  } catch (error) {
    logger.error('Error updating module:', { error: error.message });
    throw new Error(`Error updating module: ${error.message}`);
  }
};

/**
 * Delete module
 * @param {string} id - Module ID
 * @returns {Promise<boolean>} Success status
 */
const deleteModule = async (id) => {
  try {
    // Find module
    const module = await Module.findOne({ id });
    
    if (!module) {
      throw new Error('Module not found');
    }
    
    // Check if module is referenced by other modules as a prerequisite
    const referencingModules = await Module.find({
      'prerequisites.modules': id
    });
    
    if (referencingModules.length > 0) {
      throw new Error('Cannot delete module as it is a prerequisite for other modules');
    }
    
    // Delete activities associated with this module
    await Activity.deleteMany({ moduleId: id });
    
    // Delete module
    await Module.deleteOne({ id });
    
    return true;
  } catch (error) {
    logger.error('Error deleting module:', { error: error.message });
    throw new Error(`Error deleting module: ${error.message}`);
  }
};

/**
 * Check if user meets module prerequisites
 * @param {string} userId - User ID
 * @param {string} moduleId - Module ID
 * @returns {Promise<Object>} Prerequisite check result
 */
const checkPrerequisites = async (userId, moduleId) => {
  try {
    // Get module
    const module = await Module.findOne({ id: moduleId });
    
    if (!module) {
      throw new Error('Module not found');
    }
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user progress
    const progress = await Progress.findOne({ userId });
    
    // If module is not gated, return success
    if (!module.sequence.isGated) {
      return {
        meetsPrerequisites: true,
        missingPrerequisites: []
      };
    }
    
    const missingPrerequisites = [];
    
    // Check module prerequisites
    if (module.prerequisites.modules && module.prerequisites.modules.length > 0) {
      for (const prereqModuleId of module.prerequisites.modules) {
        // Check if user has completed this prerequisite module
        const moduleProgress = progress?.modules?.find(m => m.moduleId === prereqModuleId);
        
        if (!moduleProgress || moduleProgress.status !== 'completed') {
          // Get prerequisite module details
          const prereqModule = await Module.findOne({ id: prereqModuleId });
          
          missingPrerequisites.push({
            type: 'module',
            id: prereqModuleId,
            title: prereqModule ? prereqModule.title : prereqModuleId,
            description: 'Module completion required'
          });
        }
      }
    }
    
    // Check XP level prerequisite
    if (module.prerequisites.xpLevel > 0 && user.totalXP < module.prerequisites.xpLevel) {
      missingPrerequisites.push({
        type: 'xp',
        required: module.prerequisites.xpLevel,
        current: user.totalXP,
        description: `XP level ${module.prerequisites.xpLevel} required`
      });
    }
    
    // Check badge prerequisites
    if (module.prerequisites.badges && module.prerequisites.badges.length > 0) {
      for (const badgeId of module.prerequisites.badges) {
        // Check if user has this badge
        const hasBadge = user.badgesEarned.some(b => b.id === badgeId);
        
        if (!hasBadge) {
          missingPrerequisites.push({
            type: 'badge',
            id: badgeId,
            description: 'Badge required'
          });
        }
      }
    }
    
    // Check custom prerequisites
    if (module.prerequisites.customRequirements && module.prerequisites.customRequirements.length > 0) {
      for (const requirement of module.prerequisites.customRequirements) {
        // Handle different types of custom requirements
        switch (requirement.type) {
          case 'score':
            // Check if user has achieved the required score in a specific module
            const moduleId = requirement.value.moduleId;
            const requiredScore = requirement.value.score;
            
            const moduleProgress = progress?.modules?.find(m => m.moduleId === moduleId);
            
            if (!moduleProgress || moduleProgress.currentScore < requiredScore) {
              missingPrerequisites.push({
                type: 'custom_score',
                moduleId,
                requiredScore,
                currentScore: moduleProgress ? moduleProgress.currentScore : 0,
                description: requirement.description
              });
            }
            break;
            
          case 'activity':
            // Check if user has completed a specific activity
            const activityId = requirement.value;
            
            const activityCompleted = progress?.modules?.some(m => 
              m.activitiesCompleted.some(a => 
                a.activityId === activityId && a.status === 'completed'
              )
            );
            
            if (!activityCompleted) {
              missingPrerequisites.push({
                type: 'custom_activity',
                activityId,
                description: requirement.description
              });
            }
            break;
            
          case 'time':
            // Check if user has spent enough time on a specific module
            const timeModuleId = requirement.value.moduleId;
            const requiredTime = requirement.value.time;
            
            const timeModuleProgress = progress?.modules?.find(m => m.moduleId === timeModuleId);
            
            if (!timeModuleProgress || timeModuleProgress.timeSpent < requiredTime) {
              missingPrerequisites.push({
                type: 'custom_time',
                moduleId: timeModuleId,
                requiredTime,
                currentTime: timeModuleProgress ? timeModuleProgress.timeSpent : 0,
                description: requirement.description
              });
            }
            break;
            
          default:
            // For other custom requirements, just add them to missing prerequisites
            missingPrerequisites.push({
              type: 'custom',
              description: requirement.description
            });
        }
      }
    }
    
    return {
      meetsPrerequisites: missingPrerequisites.length === 0,
      missingPrerequisites
    };
  } catch (error) {
    logger.error('Error checking prerequisites:', { error: error.message });
    throw new Error('Error checking prerequisites');
  }
};

/**
 * Get available modules for user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of available modules with prerequisite status
 */
const getAvailableModules = async (userId) => {
  try {
    // Get all published modules
    const modules = await Module.find({ isPublished: true }).sort({ 'sequence.order': 1 });
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user progress
    const progress = await Progress.findOne({ userId });
    
    // Check prerequisites for each module
    const availableModules = await Promise.all(modules.map(async (module) => {
      // Check if user has already started or completed this module
      const moduleProgress = progress?.modules?.find(m => m.moduleId === module.id);
      
      // If module is already started or completed, it's available
      if (moduleProgress) {
        return {
          ...module.toObject(),
          status: moduleProgress.status,
          progress: moduleProgress,
          isAvailable: true,
          prerequisitesMet: true,
          missingPrerequisites: []
        };
      }
      
      // Check prerequisites
      const { meetsPrerequisites, missingPrerequisites } = await checkPrerequisites(userId, module.id);
      
      return {
        ...module.toObject(),
        status: 'not_started',
        progress: null,
        isAvailable: meetsPrerequisites || !module.sequence.isGated,
        prerequisitesMet: meetsPrerequisites,
        missingPrerequisites
      };
    }));
    
    return availableModules;
  } catch (error) {
    logger.error('Error getting available modules:', { error: error.message });
    throw new Error('Error getting available modules');
  }
};

/**
 * Get next recommended module for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Next recommended module
 */
const getNextRecommendedModule = async (userId) => {
  try {
    // Get available modules
    const availableModules = await getAvailableModules(userId);
    
    // Filter modules that are available and not completed
    const incompleteModules = availableModules.filter(
      module => module.isAvailable && (!module.status || module.status !== 'completed')
    );
    
    // If there are modules in progress, recommend the first one
    const inProgressModules = incompleteModules.filter(module => module.status === 'in_progress');
    
    if (inProgressModules.length > 0) {
      return inProgressModules[0];
    }
    
    // If no modules in progress, recommend the first available module that hasn't been started
    const notStartedModules = incompleteModules.filter(module => !module.status || module.status === 'not_started');
    
    if (notStartedModules.length > 0) {
      return notStartedModules[0];
    }
    
    // If all modules are completed, return null
    return null;
  } catch (error) {
    logger.error('Error getting next recommended module:', { error: error.message });
    throw new Error('Error getting next recommended module');
  }
};

module.exports = {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  checkPrerequisites,
  getAvailableModules,
  getNextRecommendedModule
};