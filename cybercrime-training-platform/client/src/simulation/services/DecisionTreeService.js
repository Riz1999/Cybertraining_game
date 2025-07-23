/**
 * Decision Tree Service
 * 
 * This service handles the navigation and state management for decision-based scenarios.
 */
import { DecisionTree, DecisionTreeProgress } from '../models/DecisionTreeModels';

export class DecisionTreeService {
  constructor() {
    this.currentTree = null;
    this.currentProgress = null;
    this.eventListeners = new Map();
  }

  /**
   * Initialize a decision tree scenario
   * @param {Object} treeData - The decision tree data
   * @param {string} userId - The user ID
   * @returns {Promise<DecisionTreeProgress>} - The initialized progress
   */
  async initializeTree(treeData, userId) {
    try {
      this.currentTree = new DecisionTree(treeData);
      
      // Validate the tree structure
      const validation = this.currentTree.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid decision tree: ${validation.errors.join(', ')}`);
      }

      // Initialize progress
      this.currentProgress = new DecisionTreeProgress({
        userId,
        decisionTreeId: this.currentTree.id,
        currentDecisionId: this.currentTree.startDecisionId,
        startTime: new Date()
      });

      this.emit('treeInitialized', {
        tree: this.currentTree,
        progress: this.currentProgress
      });

      return this.currentProgress;
    } catch (error) {
      console.error('Error initializing decision tree:', error);
      throw error;
    }
  }

  /**
   * Get the current decision point
   * @returns {DecisionPoint|null} - The current decision point
   */
  getCurrentDecision() {
    if (!this.currentTree || !this.currentProgress) {
      return null;
    }

    return this.currentTree.getDecisionPoint(this.currentProgress.currentDecisionId);
  }

  /**
   * Make a decision and navigate to the next point
   * @param {string} optionId - The ID of the chosen option
   * @returns {Promise<Object>} - The decision result
   */
  async makeDecision(optionId) {
    if (!this.currentTree || !this.currentProgress) {
      throw new Error('No active decision tree session');
    }

    const currentDecision = this.getCurrentDecision();
    if (!currentDecision) {
      throw new Error('No current decision point found');
    }

    // Evaluate the decision
    const evaluation = currentDecision.evaluateDecision(optionId);
    
    // Record the decision in progress
    this.currentProgress.recordDecision(
      currentDecision.id,
      optionId,
      evaluation
    );

    // Emit decision made event
    this.emit('decisionMade', {
      decisionId: currentDecision.id,
      optionId,
      evaluation,
      progress: this.currentProgress
    });

    // Check if scenario is completed
    if (this.currentProgress.isCompleted) {
      this.emit('treeCompleted', {
        progress: this.currentProgress,
        metrics: this.currentProgress.getPerformanceMetrics()
      });
    }

    return {
      evaluation,
      nextDecision: this.getCurrentDecision(),
      isCompleted: this.currentProgress.isCompleted,
      progress: this.currentProgress
    };
  }

  /**
   * Get the decision history for the current session
   * @returns {Array} - Array of decision history
   */
  getDecisionHistory() {
    return this.currentProgress ? this.currentProgress.decisions : [];
  }

  /**
   * Get performance metrics for the current session
   * @returns {Object|null} - Performance metrics
   */
  getPerformanceMetrics() {
    return this.currentProgress ? this.currentProgress.getPerformanceMetrics() : null;
  }

  /**
   * Reset the current decision tree session
   */
  reset() {
    this.currentTree = null;
    this.currentProgress = null;
    this.emit('treeReset');
  }

  /**
   * Get the complete decision path taken by the user
   * @returns {Array} - Array of decision points and choices
   */
  getDecisionPath() {
    if (!this.currentProgress || !this.currentTree) {
      return [];
    }

    return this.currentProgress.decisions.map(decision => {
      const decisionPoint = this.currentTree.getDecisionPoint(decision.decisionId);
      const option = decisionPoint?.options.find(opt => opt.id === decision.optionId);
      
      return {
        decisionPoint: decisionPoint?.title || 'Unknown Decision',
        option: option?.text || 'Unknown Option',
        points: decision.points,
        isOptimal: decision.isOptimal,
        timestamp: decision.timestamp,
        consequences: decision.consequences
      };
    });
  }

  /**
   * Calculate the optimal path through the decision tree
   * @returns {Array} - Array of optimal decisions
   */
  calculateOptimalPath() {
    if (!this.currentTree) {
      return [];
    }

    const optimalPath = [];
    let currentDecisionId = this.currentTree.startDecisionId;

    while (currentDecisionId) {
      const decisionPoint = this.currentTree.getDecisionPoint(currentDecisionId);
      if (!decisionPoint) break;

      // Find the optimal option (highest points or marked as optimal)
      const optimalOption = decisionPoint.options.reduce((best, option) => {
        if (option.isOptimal) return option;
        if (!best || option.points > best.points) return option;
        return best;
      }, null);

      if (optimalOption) {
        optimalPath.push({
          decisionId: currentDecisionId,
          decisionTitle: decisionPoint.title,
          optionId: optimalOption.id,
          optionText: optimalOption.text,
          points: optimalOption.points
        });

        currentDecisionId = optimalOption.nextDecisionId;
      } else {
        break;
      }
    }

    return optimalPath;
  }

  /**
   * Get suggestions for improvement based on current performance
   * @returns {Array} - Array of improvement suggestions
   */
  getImprovementSuggestions() {
    if (!this.currentProgress) {
      return [];
    }

    const suggestions = [];
    const metrics = this.getPerformanceMetrics();
    const optimalPath = this.calculateOptimalPath();

    // Compare user path with optimal path
    const userDecisions = this.currentProgress.decisions;
    
    userDecisions.forEach((userDecision, index) => {
      const optimalDecision = optimalPath[index];
      
      if (optimalDecision && userDecision.optionId !== optimalDecision.optionId) {
        suggestions.push({
          type: 'suboptimal_choice',
          decisionPoint: optimalDecision.decisionTitle,
          userChoice: userDecision.optionId,
          optimalChoice: optimalDecision.optionText,
          pointsLost: optimalDecision.points - userDecision.points,
          suggestion: `Consider choosing "${optimalDecision.optionText}" for better outcomes.`
        });
      }
    });

    // Add general performance suggestions
    if (metrics.optimalDecisionRate < 0.7) {
      suggestions.push({
        type: 'general_performance',
        suggestion: 'Focus on understanding the context and consequences of each decision option.'
      });
    }

    if (metrics.averageTimePerDecision > 60000) { // More than 1 minute per decision
      suggestions.push({
        type: 'decision_speed',
        suggestion: 'Try to make decisions more quickly while maintaining accuracy.'
      });
    }

    return suggestions;
  }

  /**
   * Add an event listener
   * @param {string} event - The event name
   * @param {Function} callback - The callback function
   */
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - The event name
   * @param {Function} callback - The callback function
   */
  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all listeners
   * @param {string} event - The event name
   * @param {any} data - The event data
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Save the current progress (placeholder for persistence)
   * @returns {Promise<void>}
   */
  async saveProgress() {
    if (!this.currentProgress) {
      return;
    }

    // In a real implementation, this would save to a backend API
    try {
      const progressData = this.currentProgress.toJSON();
      localStorage.setItem(
        `decision_tree_progress_${this.currentProgress.decisionTreeId}_${this.currentProgress.userId}`,
        JSON.stringify(progressData)
      );
      
      this.emit('progressSaved', { progress: this.currentProgress });
    } catch (error) {
      console.error('Error saving decision tree progress:', error);
      throw error;
    }
  }

  /**
   * Load progress from storage (placeholder for persistence)
   * @param {string} treeId - The decision tree ID
   * @param {string} userId - The user ID
   * @returns {Promise<DecisionTreeProgress|null>}
   */
  async loadProgress(treeId, userId) {
    try {
      const key = `decision_tree_progress_${treeId}_${userId}`;
      const progressData = localStorage.getItem(key);
      
      if (progressData) {
        const data = JSON.parse(progressData);
        this.currentProgress = new DecisionTreeProgress(data);
        this.emit('progressLoaded', { progress: this.currentProgress });
        return this.currentProgress;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading decision tree progress:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const decisionTreeService = new DecisionTreeService();

export default DecisionTreeService;