/**
 * Module Data Models
 * 
 * This file defines the core data models for the module management system.
 */

/**
 * Base class for all module models
 */
export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  update(data = {}) {
    Object.assign(this, data);
    this.updatedAt = new Date();
    return this;
  }
}

/**
 * Badge model
 * Represents a badge that can be earned by completing modules or activities
 */
export class Badge extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.description = data.description || '';
    this.imageUrl = data.imageUrl || '';
    this.category = data.category || 'general';
    this.points = data.points || 0;
    this.rarity = data.rarity || 'common'; // common, uncommon, rare, epic, legendary
    this.requirements = data.requirements || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      category: this.category,
      points: this.points,
      rarity: this.rarity,
      requirements: this.requirements,
      isActive: this.isActive
    };
  }
}

/**
 * Activity model
 * Represents an individual activity within a module
 */
export class Activity extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || 'quiz'; // quiz, simulation, roleplay, dragdrop, interactive, reading
    this.content = data.content || {};
    this.points = data.points || 0;
    this.timeLimit = data.timeLimit || null; // in seconds, null for no limit
    this.passingScore = data.passingScore || 0.7; // 70% by default
    this.maxAttempts = data.maxAttempts || 3;
    this.isRequired = data.isRequired !== undefined ? data.isRequired : true;
    this.order = data.order || 0;
    this.prerequisites = data.prerequisites || []; // Array of activity IDs
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      type: this.type,
      content: this.content,
      points: this.points,
      timeLimit: this.timeLimit,
      passingScore: this.passingScore,
      maxAttempts: this.maxAttempts,
      isRequired: this.isRequired,
      order: this.order,
      prerequisites: this.prerequisites,
      metadata: this.metadata
    };
  }

  /**
   * Check if this activity is available based on completed prerequisites
   * @param {Array} completedActivityIds - Array of completed activity IDs
   * @returns {boolean} - Whether the activity is available
   */
  isAvailable(completedActivityIds = []) {
    return this.prerequisites.every(prereqId => 
      completedActivityIds.includes(prereqId)
    );
  }
}

/**
 * Module model
 * Represents a training module containing multiple activities
 */
export class Module extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.objectives = data.objectives || [];
    this.prerequisites = data.prerequisites || []; // Array of module IDs
    this.activities = (data.activities || []).map(activity =>
      activity instanceof Activity ? activity : new Activity(activity)
    );
    this.badgeReward = data.badgeReward instanceof Badge 
      ? data.badgeReward 
      : (data.badgeReward ? new Badge(data.badgeReward) : null);
    this.minPassingScore = data.minPassingScore || 0.8; // 80% by default
    this.estimatedDuration = data.estimatedDuration || 60; // in minutes
    this.version = data.version || '1.0.0';
    this.isPublished = data.isPublished !== undefined ? data.isPublished : false;
    this.category = data.category || 'general';
    this.difficulty = data.difficulty || 'beginner'; // beginner, intermediate, advanced
    this.tags = data.tags || [];
    this.order = data.order || 0;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      objectives: this.objectives,
      prerequisites: this.prerequisites,
      activities: this.activities.map(activity => activity.toJSON()),
      badgeReward: this.badgeReward ? this.badgeReward.toJSON() : null,
      minPassingScore: this.minPassingScore,
      estimatedDuration: this.estimatedDuration,
      version: this.version,
      isPublished: this.isPublished,
      category: this.category,
      difficulty: this.difficulty,
      tags: this.tags,
      order: this.order,
      metadata: this.metadata
    };
  }

  /**
   * Add an activity to the module
   * @param {Activity} activity - The activity to add
   * @returns {Module} - The module instance for chaining
   */
  addActivity(activity) {
    if (!(activity instanceof Activity)) {
      activity = new Activity(activity);
    }
    this.activities.push(activity);
    this.activities.sort((a, b) => a.order - b.order);
    return this;
  }

  /**
   * Remove an activity from the module
   * @param {string} activityId - The ID of the activity to remove
   * @returns {Module} - The module instance for chaining
   */
  removeActivity(activityId) {
    this.activities = this.activities.filter(activity => activity.id !== activityId);
    return this;
  }

  /**
   * Get an activity by ID
   * @param {string} activityId - The ID of the activity to get
   * @returns {Activity|null} - The activity or null if not found
   */
  getActivity(activityId) {
    return this.activities.find(activity => activity.id === activityId) || null;
  }

  /**
   * Get activities that are available based on completed activities
   * @param {Array} completedActivityIds - Array of completed activity IDs
   * @returns {Array} - Array of available activities
   */
  getAvailableActivities(completedActivityIds = []) {
    return this.activities.filter(activity => 
      activity.isAvailable(completedActivityIds)
    );
  }

  /**
   * Calculate the total points available in this module
   * @returns {number} - Total points
   */
  getTotalPoints() {
    return this.activities.reduce((total, activity) => total + activity.points, 0);
  }

  /**
   * Check if this module is available based on completed prerequisites
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @returns {boolean} - Whether the module is available
   */
  isAvailable(completedModuleIds = []) {
    return this.prerequisites.every(prereqId => 
      completedModuleIds.includes(prereqId)
    );
  }

  /**
   * Validate the module structure
   * @returns {Object} - Validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.title.trim()) {
      errors.push('Module title is required');
    }

    if (!this.description.trim()) {
      errors.push('Module description is required');
    }

    if (this.activities.length === 0) {
      errors.push('Module must have at least one activity');
    }

    if (this.minPassingScore < 0 || this.minPassingScore > 1) {
      errors.push('Minimum passing score must be between 0 and 1');
    }

    // Validate activities
    this.activities.forEach((activity, index) => {
      const activityValidation = activity.validate ? activity.validate() : { isValid: true, errors: [] };
      if (!activityValidation.isValid) {
        errors.push(`Activity ${index + 1}: ${activityValidation.errors.join(', ')}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * ModuleSequence model
 * Represents a sequence of modules that form a learning path
 */
export class ModuleSequence extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.modules = (data.modules || []).map(module =>
      module instanceof Module ? module : new Module(module)
    );
    this.isRequired = data.isRequired !== undefined ? data.isRequired : true;
    this.category = data.category || 'general';
    this.estimatedDuration = data.estimatedDuration || 0; // calculated from modules
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      modules: this.modules.map(module => module.toJSON()),
      isRequired: this.isRequired,
      category: this.category,
      estimatedDuration: this.estimatedDuration,
      metadata: this.metadata
    };
  }

  /**
   * Add a module to the sequence
   * @param {Module} module - The module to add
   * @returns {ModuleSequence} - The sequence instance for chaining
   */
  addModule(module) {
    if (!(module instanceof Module)) {
      module = new Module(module);
    }
    this.modules.push(module);
    this.modules.sort((a, b) => a.order - b.order);
    this.calculateEstimatedDuration();
    return this;
  }

  /**
   * Calculate the total estimated duration
   * @returns {number} - Total duration in minutes
   */
  calculateEstimatedDuration() {
    this.estimatedDuration = this.modules.reduce(
      (total, module) => total + module.estimatedDuration, 
      0
    );
    return this.estimatedDuration;
  }

  /**
   * Get the next available module in the sequence
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @returns {Module|null} - The next available module or null
   */
  getNextAvailableModule(completedModuleIds = []) {
    return this.modules.find(module => 
      !completedModuleIds.includes(module.id) && 
      module.isAvailable(completedModuleIds)
    ) || null;
  }
}

/**
 * ContentSchema model
 * Represents validation schema for module content
 */
export class ContentSchema extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.version = data.version || '1.0.0';
    this.schema = data.schema || {};
    this.activityType = data.activityType || 'generic';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      version: this.version,
      schema: this.schema,
      activityType: this.activityType,
      isActive: this.isActive
    };
  }

  /**
   * Validate content against this schema
   * @param {Object} content - The content to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  validateContent(content) {
    // Basic validation implementation
    // In a real application, you might use a library like Joi or Yup
    const errors = [];
    
    try {
      // Perform schema validation here
      // This is a simplified implementation
      if (this.schema.required) {
        this.schema.required.forEach(field => {
          if (!content[field]) {
            errors.push(`Required field '${field}' is missing`);
          }
        });
      }
    } catch (error) {
      errors.push(`Schema validation error: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default {
  BaseModel,
  Badge,
  Activity,
  Module,
  ModuleSequence,
  ContentSchema
};