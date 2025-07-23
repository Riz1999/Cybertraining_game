/**
 * Module Sequencing Service
 * 
 * This service handles the logic for module sequencing and prerequisites.
 */
import { Module, Activity, ModuleSequence } from '../models/ModuleModels';

/**
 * ModuleSequencingService class
 * Handles module ordering, prerequisites, and availability logic
 */
export class ModuleSequencingService {
  constructor() {
    this.modules = new Map();
    this.sequences = new Map();
  }

  /**
   * Register a module with the sequencing service
   * @param {Module} module - The module to register
   */
  registerModule(module) {
    if (!(module instanceof Module)) {
      module = new Module(module);
    }
    this.modules.set(module.id, module);
  }

  /**
   * Register a module sequence
   * @param {ModuleSequence} sequence - The sequence to register
   */
  registerSequence(sequence) {
    if (!(sequence instanceof ModuleSequence)) {
      sequence = new ModuleSequence(sequence);
    }
    this.sequences.set(sequence.id, sequence);
  }

  /**
   * Get all modules ordered by their sequence
   * @returns {Array} - Array of modules in order
   */
  getOrderedModules() {
    return Array.from(this.modules.values())
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get available modules based on completed modules
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @returns {Array} - Array of available modules
   */
  getAvailableModules(completedModuleIds = []) {
    return this.getOrderedModules().filter(module => 
      module.isAvailable(completedModuleIds) && module.isPublished
    );
  }

  /**
   * Get the next recommended module for a user
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @param {Array} inProgressModuleIds - Array of in-progress module IDs
   * @returns {Module|null} - The next recommended module or null
   */
  getNextRecommendedModule(completedModuleIds = [], inProgressModuleIds = []) {
    const availableModules = this.getAvailableModules(completedModuleIds);
    
    // Filter out modules that are already in progress or completed
    const candidateModules = availableModules.filter(module => 
      !completedModuleIds.includes(module.id) && 
      !inProgressModuleIds.includes(module.id)
    );

    // Return the first available module (lowest order)
    return candidateModules.length > 0 ? candidateModules[0] : null;
  }

  /**
   * Check if a module can be started
   * @param {string} moduleId - The ID of the module to check
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @returns {Object} - Result with canStart boolean and reason
   */
  canStartModule(moduleId, completedModuleIds = []) {
    const module = this.modules.get(moduleId);
    
    if (!module) {
      return {
        canStart: false,
        reason: 'Module not found'
      };
    }

    if (!module.isPublished) {
      return {
        canStart: false,
        reason: 'Module is not published'
      };
    }

    if (!module.isAvailable(completedModuleIds)) {
      const missingPrereqs = module.prerequisites.filter(prereqId => 
        !completedModuleIds.includes(prereqId)
      );
      
      return {
        canStart: false,
        reason: `Missing prerequisites: ${missingPrereqs.join(', ')}`,
        missingPrerequisites: missingPrereqs
      };
    }

    return {
      canStart: true,
      reason: 'Module is available'
    };
  }

  /**
   * Get module dependencies (prerequisites and dependents)
   * @param {string} moduleId - The ID of the module
   * @returns {Object} - Object with prerequisites and dependents arrays
   */
  getModuleDependencies(moduleId) {
    const module = this.modules.get(moduleId);
    
    if (!module) {
      return {
        prerequisites: [],
        dependents: []
      };
    }

    // Get prerequisites
    const prerequisites = module.prerequisites.map(prereqId => 
      this.modules.get(prereqId)
    ).filter(Boolean);

    // Get dependents (modules that depend on this module)
    const dependents = Array.from(this.modules.values()).filter(m => 
      m.prerequisites.includes(moduleId)
    );

    return {
      prerequisites,
      dependents
    };
  }

  /**
   * Validate module sequence for circular dependencies
   * @returns {Object} - Validation result with isValid and errors
   */
  validateSequence() {
    const errors = [];
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (moduleId) => {
      if (recursionStack.has(moduleId)) {
        return true; // Cycle detected
      }

      if (visited.has(moduleId)) {
        return false; // Already processed
      }

      visited.add(moduleId);
      recursionStack.add(moduleId);

      const module = this.modules.get(moduleId);
      if (module) {
        for (const prereqId of module.prerequisites) {
          if (hasCycle(prereqId)) {
            return true;
          }
        }
      }

      recursionStack.delete(moduleId);
      return false;
    };

    // Check each module for cycles
    for (const moduleId of this.modules.keys()) {
      if (hasCycle(moduleId)) {
        errors.push(`Circular dependency detected involving module: ${moduleId}`);
      }
    }

    // Check for invalid prerequisites
    for (const [moduleId, module] of this.modules.entries()) {
      for (const prereqId of module.prerequisites) {
        if (!this.modules.has(prereqId)) {
          errors.push(`Module ${moduleId} has invalid prerequisite: ${prereqId}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get learning path for a user
   * @param {Array} completedModuleIds - Array of completed module IDs
   * @param {string} targetModuleId - Optional target module ID
   * @returns {Array} - Array of modules in learning path order
   */
  getLearningPath(completedModuleIds = [], targetModuleId = null) {
    const path = [];
    const remaining = new Set(this.modules.keys());
    
    // Remove completed modules from remaining
    completedModuleIds.forEach(id => remaining.delete(id));

    // If target module specified, find path to that module
    if (targetModuleId && remaining.has(targetModuleId)) {
      const targetModule = this.modules.get(targetModuleId);
      const requiredModules = this.getRequiredModulesFor(targetModuleId, completedModuleIds);
      
      return requiredModules.map(id => this.modules.get(id)).filter(Boolean);
    }

    // Otherwise, return optimal learning path for all remaining modules
    while (remaining.size > 0) {
      let foundAvailable = false;
      
      for (const moduleId of remaining) {
        const module = this.modules.get(moduleId);
        if (module && module.isAvailable([...completedModuleIds, ...path.map(m => m.id)])) {
          path.push(module);
          remaining.delete(moduleId);
          foundAvailable = true;
          break;
        }
      }
      
      // If no available modules found, break to avoid infinite loop
      if (!foundAvailable) {
        break;
      }
    }

    return path.sort((a, b) => a.order - b.order);
  }

  /**
   * Get all modules required to complete a target module
   * @param {string} targetModuleId - The target module ID
   * @param {Array} completedModuleIds - Array of already completed module IDs
   * @returns {Array} - Array of required module IDs in order
   */
  getRequiredModulesFor(targetModuleId, completedModuleIds = []) {
    const required = [];
    const visited = new Set();

    const collectRequirements = (moduleId) => {
      if (visited.has(moduleId) || completedModuleIds.includes(moduleId)) {
        return;
      }

      visited.add(moduleId);
      const module = this.modules.get(moduleId);
      
      if (module) {
        // First collect all prerequisites
        module.prerequisites.forEach(prereqId => {
          collectRequirements(prereqId);
        });
        
        // Then add this module
        if (!completedModuleIds.includes(moduleId)) {
          required.push(moduleId);
        }
      }
    };

    collectRequirements(targetModuleId);
    return required;
  }

  /**
   * Get module statistics
   * @returns {Object} - Statistics about modules and sequences
   */
  getStatistics() {
    const modules = Array.from(this.modules.values());
    const sequences = Array.from(this.sequences.values());

    return {
      totalModules: modules.length,
      publishedModules: modules.filter(m => m.isPublished).length,
      totalActivities: modules.reduce((sum, m) => sum + m.activities.length, 0),
      totalSequences: sequences.length,
      averageModuleDuration: modules.length > 0 
        ? modules.reduce((sum, m) => sum + m.estimatedDuration, 0) / modules.length 
        : 0,
      modulesByCategory: modules.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
      }, {}),
      modulesByDifficulty: modules.reduce((acc, m) => {
        acc[m.difficulty] = (acc[m.difficulty] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

export default ModuleSequencingService;