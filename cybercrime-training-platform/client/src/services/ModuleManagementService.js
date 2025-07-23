/**
 * Module Management Service
 * 
 * This service provides a unified API for module management operations.
 */
import { Module, Activity, Badge, ModuleSequence } from '../models/ModuleModels';
import ModuleSequencingService from './ModuleSequencingService';
import PrerequisiteChecker from './PrerequisiteChecker';
import ContentSchemaValidator from './ContentSchemaValidator';

/**
 * ModuleManagementService class
 * Provides comprehensive module management functionality
 */
export class ModuleManagementService {
  constructor() {
    this.sequencingService = new ModuleSequencingService();
    this.prerequisiteChecker = new PrerequisiteChecker();
    this.schemaValidator = new ContentSchemaValidator();
    this.modules = new Map();
    this.activities = new Map();
    this.badges = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Initialize the service with data
   * @param {Object} data - Initial data containing modules, activities, badges
   */
  async initialize(data = {}) {
    try {
      // Load modules
      if (data.modules) {
        data.modules.forEach(moduleData => {
          const module = new Module(moduleData);
          this.addModule(module);
        });
      }

      // Load activities
      if (data.activities) {
        data.activities.forEach(activityData => {
          const activity = new Activity(activityData);
          this.activities.set(activity.id, activity);
        });
      }

      // Load badges
      if (data.badges) {
        data.badges.forEach(badgeData => {
          const badge = new Badge(badgeData);
          this.badges.set(badge.id, badge);
        });
      }

      // Initialize prerequisite checker with module data
      this.prerequisiteChecker.getModule = (moduleId) => this.modules.get(moduleId);
      this.prerequisiteChecker.getActivity = (activityId) => this.activities.get(activityId);

      this.emit('initialized', { moduleCount: this.modules.size });
      return true;
    } catch (error) {
      console.error('Error initializing ModuleManagementService:', error);
      this.emit('error', { error, context: 'initialization' });
      return false;
    }
  }

  /**
   * Add a module to the system
   * @param {Module|Object} moduleData - The module to add
   * @returns {Module} - The added module
   */
  addModule(moduleData) {
    const module = moduleData instanceof Module ? moduleData : new Module(moduleData);
    
    // Validate module
    const validation = module.validate();
    if (!validation.isValid) {
      throw new Error(`Module validation failed: ${validation.errors.join(', ')}`);
    }

    // Store module
    this.modules.set(module.id, module);
    
    // Register with sequencing service
    this.sequencingService.registerModule(module);
    
    // Add activities to activity map
    module.activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });

    this.emit('moduleAdded', { module });
    return module;
  }

  /**
   * Update a module
   * @param {string} moduleId - The module ID to update
   * @param {Object} updates - The updates to apply
   * @returns {Module} - The updated module
   */
  updateModule(moduleId, updates) {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    // Apply updates
    module.update(updates);
    
    // Re-validate
    const validation = module.validate();
    if (!validation.isValid) {
      throw new Error(`Module validation failed after update: ${validation.errors.join(', ')}`);
    }

    // Update in sequencing service
    this.sequencingService.registerModule(module);

    this.emit('moduleUpdated', { module, updates });
    return module;
  }

  /**
   * Remove a module
   * @param {string} moduleId - The module ID to remove
   * @returns {boolean} - Whether the removal was successful
   */
  removeModule(moduleId) {
    const module = this.modules.get(moduleId);
    if (!module) {
      return false;
    }

    // Check if other modules depend on this one
    const dependencies = this.sequencingService.getModuleDependencies(moduleId);
    if (dependencies.dependents.length > 0) {
      throw new Error(`Cannot remove module ${moduleId}: it is required by other modules`);
    }

    // Remove activities
    module.activities.forEach(activity => {
      this.activities.delete(activity.id);
    });

    // Remove module
    this.modules.delete(moduleId);

    this.emit('moduleRemoved', { moduleId, module });
    return true;
  }

  /**
   * Get a module by ID
   * @param {string} moduleId - The module ID
   * @returns {Module|null} - The module or null if not found
   */
  getModule(moduleId) {
    return this.modules.get(moduleId) || null;
  }

  /**
   * Get all modules
   * @param {Object} filters - Optional filters
   * @returns {Array} - Array of modules
   */
  getModules(filters = {}) {
    let modules = Array.from(this.modules.values());

    // Apply filters
    if (filters.category) {
      modules = modules.filter(m => m.category === filters.category);
    }
    if (filters.difficulty) {
      modules = modules.filter(m => m.difficulty === filters.difficulty);
    }
    if (filters.isPublished !== undefined) {
      modules = modules.filter(m => m.isPublished === filters.isPublished);
    }
    if (filters.tags && filters.tags.length > 0) {
      modules = modules.filter(m => 
        filters.tags.some(tag => m.tags.includes(tag))
      );
    }

    // Sort by order
    return modules.sort((a, b) => a.order - b.order);
  }

  /**
   * Get available modules for a user
   * @param {Object} userProgress - User's progress data
   * @returns {Array} - Array of available modules
   */
  getAvailableModules(userProgress) {
    const completedModuleIds = Object.keys(userProgress.modules || {})
      .filter(id => userProgress.modules[id].status === 'completed');
    
    return this.sequencingService.getAvailableModules(completedModuleIds);
  }

  /**
   * Get next recommended module for a user
   * @param {Object} userProgress - User's progress data
   * @returns {Module|null} - The next recommended module
   */
  getNextRecommendedModule(userProgress) {
    const completedModuleIds = Object.keys(userProgress.modules || {})
      .filter(id => userProgress.modules[id].status === 'completed');
    
    const inProgressModuleIds = Object.keys(userProgress.modules || {})
      .filter(id => userProgress.modules[id].status === 'in_progress');

    return this.sequencingService.getNextRecommendedModule(completedModuleIds, inProgressModuleIds);
  }

  /**
   * Check if a user can start a module
   * @param {string} moduleId - The module ID
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with canStart boolean and details
   */
  canUserStartModule(moduleId, userProgress) {
    const completedModuleIds = Object.keys(userProgress.modules || {})
      .filter(id => userProgress.modules[id].status === 'completed');

    const sequencingResult = this.sequencingService.canStartModule(moduleId, completedModuleIds);
    
    if (!sequencingResult.canStart) {
      return sequencingResult;
    }

    // Check detailed prerequisites
    const prerequisiteResult = this.prerequisiteChecker.checkModulePrerequisites(
      moduleId, 
      userProgress, 
      { module: this.getModule(moduleId) }
    );

    return {
      canStart: prerequisiteResult.isMet,
      reason: prerequisiteResult.reason,
      details: prerequisiteResult.details,
      nextSteps: prerequisiteResult.details ? 
        this.prerequisiteChecker.getNextSteps(prerequisiteResult.details.filter(d => !d.isMet)) : 
        []
    };
  }

  /**
   * Add an activity to a module
   * @param {string} moduleId - The module ID
   * @param {Activity|Object} activityData - The activity to add
   * @returns {Activity} - The added activity
   */
  addActivityToModule(moduleId, activityData) {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    const activity = activityData instanceof Activity ? activityData : new Activity(activityData);
    
    // Validate activity content if schema is available
    if (activity.type) {
      const validation = this.schemaValidator.validateContent(activity.content, activity.type);
      if (!validation.isValid) {
        console.warn(`Activity content validation warnings:`, validation.errors);
      }
    }

    module.addActivity(activity);
    this.activities.set(activity.id, activity);

    this.emit('activityAdded', { moduleId, activity });
    return activity;
  }

  /**
   * Update an activity
   * @param {string} activityId - The activity ID
   * @param {Object} updates - The updates to apply
   * @returns {Activity} - The updated activity
   */
  updateActivity(activityId, updates) {
    const activity = this.activities.get(activityId);
    if (!activity) {
      throw new Error(`Activity ${activityId} not found`);
    }

    activity.update(updates);

    // Validate content if type changed
    if (updates.content || updates.type) {
      const validation = this.schemaValidator.validateContent(activity.content, activity.type);
      if (!validation.isValid) {
        console.warn(`Activity content validation warnings:`, validation.errors);
      }
    }

    this.emit('activityUpdated', { activity, updates });
    return activity;
  }

  /**
   * Get learning path for a user
   * @param {Object} userProgress - User's progress data
   * @param {string} targetModuleId - Optional target module
   * @returns {Array} - Array of modules in learning path
   */
  getLearningPath(userProgress, targetModuleId = null) {
    const completedModuleIds = Object.keys(userProgress.modules || {})
      .filter(id => userProgress.modules[id].status === 'completed');

    return this.sequencingService.getLearningPath(completedModuleIds, targetModuleId);
  }

  /**
   * Get module statistics
   * @returns {Object} - Comprehensive statistics
   */
  getStatistics() {
    const sequencingStats = this.sequencingService.getStatistics();
    
    return {
      ...sequencingStats,
      totalActivities: this.activities.size,
      totalBadges: this.badges.size,
      activitiesByType: Array.from(this.activities.values()).reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {}),
      badgesByCategory: Array.from(this.badges.values()).reduce((acc, badge) => {
        acc[badge.category] = (acc[badge.category] || 0) + 1;
        return acc;
      }, {})
    };
  }

  /**
   * Validate system integrity
   * @returns {Object} - Validation result
   */
  validateSystem() {
    const errors = [];
    const warnings = [];

    // Validate module sequence
    const sequenceValidation = this.sequencingService.validateSequence();
    errors.push(...sequenceValidation.errors);

    // Validate individual modules
    this.modules.forEach((module, moduleId) => {
      const moduleValidation = module.validate();
      if (!moduleValidation.isValid) {
        errors.push(`Module ${moduleId}: ${moduleValidation.errors.join(', ')}`);
      }
    });

    // Check for orphaned activities
    this.activities.forEach((activity, activityId) => {
      const parentModule = Array.from(this.modules.values()).find(m => 
        m.activities.some(a => a.id === activityId)
      );
      if (!parentModule) {
        warnings.push(`Activity ${activityId} is not associated with any module`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export system data
   * @returns {Object} - Exported data
   */
  exportData() {
    return {
      modules: Array.from(this.modules.values()).map(m => m.toJSON()),
      activities: Array.from(this.activities.values()).map(a => a.toJSON()),
      badges: Array.from(this.badges.values()).map(b => b.toJSON()),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Import system data
   * @param {Object} data - Data to import
   * @returns {boolean} - Whether import was successful
   */
  async importData(data) {
    try {
      // Clear existing data
      this.modules.clear();
      this.activities.clear();
      this.badges.clear();

      // Import new data
      await this.initialize(data);
      
      this.emit('dataImported', { 
        moduleCount: this.modules.size,
        activityCount: this.activities.size,
        badgeCount: this.badges.size
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      this.emit('error', { error, context: 'import' });
      return false;
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} listener - Event listener function
   */
  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(listener);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} listener - Event listener function
   */
  off(event, listener) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
}

export default ModuleManagementService;