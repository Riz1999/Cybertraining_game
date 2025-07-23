/**
 * Decision Tree Models
 * 
 * This file defines the data models for decision-based scenarios.
 * These models support branching narratives and complex decision trees.
 */
import { BaseModel } from './SimulationModels';

/**
 * Generate a UUID - fallback for environments without crypto.randomUUID
 */
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation for test environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Represents a decision point in a scenario
 */
export class DecisionPoint extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.context = data.context || '';
    this.scenario = data.scenario || '';
    this.timeLimit = data.timeLimit || null; // in seconds
    this.options = (data.options || []).map(opt => 
      opt instanceof DecisionOption ? opt : new DecisionOption(opt)
    );
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      context: this.context,
      scenario: this.scenario,
      timeLimit: this.timeLimit,
      options: this.options.map(opt => opt.toJSON()),
      metadata: this.metadata
    };
  }

  /**
   * Evaluate a decision choice
   * @param {string} optionId - The ID of the chosen option
   * @returns {Object} - Evaluation result with points, feedback, and next decision
   */
  evaluateDecision(optionId) {
    const selectedOption = this.options.find(opt => opt.id === optionId);
    
    if (!selectedOption) {
      return {
        points: 0,
        feedback: 'Invalid decision option selected.',
        nextDecisionId: null,
        consequences: [],
        isOptimal: false
      };
    }

    return {
      points: selectedOption.points,
      feedback: selectedOption.feedback,
      nextDecisionId: selectedOption.nextDecisionId,
      consequences: selectedOption.consequences,
      isOptimal: selectedOption.isOptimal,
      option: selectedOption
    };
  }
}

/**
 * Represents a decision option within a decision point
 */
export class DecisionOption extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.text = data.text || '';
    this.description = data.description || '';
    this.points = data.points || 0;
    this.feedback = data.feedback || '';
    this.consequences = data.consequences || [];
    this.nextDecisionId = data.nextDecisionId || null;
    this.isOptimal = data.isOptimal || false;
    this.category = data.category || 'neutral'; // 'escalate', 'wait', 'file_fir', 'investigate', etc.
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      description: this.description,
      points: this.points,
      feedback: this.feedback,
      consequences: this.consequences,
      nextDecisionId: this.nextDecisionId,
      isOptimal: this.isOptimal,
      category: this.category,
      metadata: this.metadata
    };
  }
}

/**
 * Represents a consequence of a decision
 */
export class DecisionConsequence extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.type = data.type || 'neutral'; // 'positive', 'negative', 'neutral'
    this.description = data.description || '';
    this.impact = data.impact || 'low'; // 'low', 'medium', 'high'
    this.delay = data.delay || 0; // delay in seconds before showing consequence
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      description: this.description,
      impact: this.impact,
      delay: this.delay,
      metadata: this.metadata
    };
  }
}

/**
 * Represents a complete decision tree scenario
 */
export class DecisionTree extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.context = data.context || '';
    this.decisionPoints = (data.decisionPoints || []).map(dp =>
      dp instanceof DecisionPoint ? dp : new DecisionPoint(dp)
    );
    this.startDecisionId = data.startDecisionId || 
      (this.decisionPoints.length > 0 ? this.decisionPoints[0].id : null);
    this.minScore = data.minScore || 0;
    this.maxScore = data.maxScore || this.calculateMaxScore();
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      context: this.context,
      decisionPoints: this.decisionPoints.map(dp => dp.toJSON()),
      startDecisionId: this.startDecisionId,
      minScore: this.minScore,
      maxScore: this.maxScore,
      metadata: this.metadata
    };
  }

  /**
   * Calculate the maximum possible score for this decision tree
   * @returns {number} - The maximum possible score
   */
  calculateMaxScore() {
    let maxScore = 0;
    
    // For decision trees, we need to find the optimal path
    // This is a simplified calculation - in reality, we'd need to traverse all paths
    this.decisionPoints.forEach(decisionPoint => {
      const maxPointsForDecision = Math.max(0, ...decisionPoint.options.map(opt => opt.points));
      maxScore += maxPointsForDecision;
    });

    return maxScore;
  }

  /**
   * Get a decision point by ID
   * @param {string} decisionId - The ID of the decision point to get
   * @returns {DecisionPoint|null} - The decision point, or null if not found
   */
  getDecisionPoint(decisionId) {
    return this.decisionPoints.find(dp => dp.id === decisionId) || null;
  }

  /**
   * Get the starting decision point
   * @returns {DecisionPoint|null} - The starting decision point, or null if none
   */
  getStartDecision() {
    if (this.startDecisionId) {
      return this.getDecisionPoint(this.startDecisionId);
    }
    return this.decisionPoints.length > 0 ? this.decisionPoints[0] : null;
  }

  /**
   * Validate the decision tree structure
   * @returns {Object} - Validation result with isValid flag and errors array
   */
  validate() {
    const errors = [];
    const decisionIds = new Set(this.decisionPoints.map(dp => dp.id));

    // Check if start decision exists
    if (this.startDecisionId && !decisionIds.has(this.startDecisionId)) {
      errors.push(`Start decision ID "${this.startDecisionId}" not found in decision points`);
    }

    // Check for orphaned references
    this.decisionPoints.forEach(decisionPoint => {
      decisionPoint.options.forEach(option => {
        if (option.nextDecisionId && !decisionIds.has(option.nextDecisionId)) {
          errors.push(`Decision option "${option.text}" references non-existent decision "${option.nextDecisionId}"`);
        }
      });
    });

    // Check for circular references (basic check)
    const visited = new Set();
    const checkCircular = (decisionId, path = []) => {
      if (path.includes(decisionId)) {
        errors.push(`Circular reference detected in path: ${path.join(' -> ')} -> ${decisionId}`);
        return;
      }

      if (visited.has(decisionId)) return;
      visited.add(decisionId);

      const decision = this.getDecisionPoint(decisionId);
      if (decision) {
        decision.options.forEach(option => {
          if (option.nextDecisionId) {
            checkCircular(option.nextDecisionId, [...path, decisionId]);
          }
        });
      }
    };

    if (this.startDecisionId) {
      checkCircular(this.startDecisionId);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Represents the state of a user's progress through a decision tree
 */
export class DecisionTreeProgress extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.userId || '';
    this.decisionTreeId = data.decisionTreeId || '';
    this.currentDecisionId = data.currentDecisionId || null;
    this.decisions = data.decisions || []; // Array of decision history
    this.totalScore = data.totalScore || 0;
    this.startTime = data.startTime || new Date();
    this.endTime = data.endTime || null;
    this.isCompleted = data.isCompleted || false;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userId: this.userId,
      decisionTreeId: this.decisionTreeId,
      currentDecisionId: this.currentDecisionId,
      decisions: this.decisions,
      totalScore: this.totalScore,
      startTime: this.startTime,
      endTime: this.endTime,
      isCompleted: this.isCompleted,
      metadata: this.metadata
    };
  }

  /**
   * Record a decision made by the user
   * @param {string} decisionId - The ID of the decision point
   * @param {string} optionId - The ID of the chosen option
   * @param {Object} evaluation - The evaluation result from the decision
   */
  recordDecision(decisionId, optionId, evaluation) {
    const decision = {
      decisionId,
      optionId,
      timestamp: new Date(),
      points: evaluation.points,
      feedback: evaluation.feedback,
      consequences: evaluation.consequences,
      isOptimal: evaluation.isOptimal
    };

    this.decisions.push(decision);
    this.totalScore += evaluation.points;
    this.currentDecisionId = evaluation.nextDecisionId;

    // Mark as completed if no next decision
    if (!evaluation.nextDecisionId) {
      this.isCompleted = true;
      this.endTime = new Date();
    }
  }

  /**
   * Get the total time spent on this decision tree
   * @returns {number} - Time spent in milliseconds
   */
  getTimeSpent() {
    const endTime = this.endTime || new Date();
    return endTime.getTime() - this.startTime.getTime();
  }

  /**
   * Get performance metrics for this decision tree session
   * @returns {Object} - Performance metrics
   */
  getPerformanceMetrics() {
    const totalDecisions = this.decisions.length;
    const optimalDecisions = this.decisions.filter(d => d.isOptimal).length;
    const timeSpent = this.getTimeSpent();

    return {
      totalDecisions,
      optimalDecisions,
      optimalDecisionRate: totalDecisions > 0 ? optimalDecisions / totalDecisions : 0,
      totalScore: this.totalScore,
      timeSpent,
      averageTimePerDecision: totalDecisions > 0 ? timeSpent / totalDecisions : 0,
      isCompleted: this.isCompleted
    };
  }
}

export default {
  DecisionPoint,
  DecisionOption,
  DecisionConsequence,
  DecisionTree,
  DecisionTreeProgress
};