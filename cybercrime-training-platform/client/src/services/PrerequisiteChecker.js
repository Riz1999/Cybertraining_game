/**
 * Prerequisite Checker Service
 * 
 * This service handles checking prerequisites for modules and activities.
 */

/**
 * PrerequisiteChecker class
 * Handles prerequisite validation and checking logic
 */
export class PrerequisiteChecker {
  constructor() {
    this.rules = new Map();
    this.customValidators = new Map();
  }

  /**
   * Register a prerequisite rule
   * @param {string} ruleId - Unique identifier for the rule
   * @param {Object} rule - The prerequisite rule configuration
   */
  registerRule(ruleId, rule) {
    this.rules.set(ruleId, {
      id: ruleId,
      type: rule.type || 'module_completion',
      conditions: rule.conditions || [],
      description: rule.description || '',
      isActive: rule.isActive !== undefined ? rule.isActive : true,
      ...rule
    });
  }

  /**
   * Register a custom validator function
   * @param {string} validatorId - Unique identifier for the validator
   * @param {Function} validator - The validator function
   */
  registerCustomValidator(validatorId, validator) {
    this.customValidators.set(validatorId, validator);
  }

  /**
   * Check if prerequisites are met for a module
   * @param {string} moduleId - The module ID to check
   * @param {Object} userProgress - User's progress data
   * @param {Object} options - Additional options
   * @returns {Object} - Result with isMet boolean and details
   */
  checkModulePrerequisites(moduleId, userProgress, options = {}) {
    const module = options.module || this.getModule(moduleId);
    
    if (!module) {
      return {
        isMet: false,
        reason: 'Module not found',
        details: []
      };
    }

    const results = [];
    let allMet = true;

    // Check basic module prerequisites
    for (const prereqId of module.prerequisites || []) {
      const result = this.checkModuleCompletion(prereqId, userProgress);
      results.push({
        type: 'module_completion',
        prerequisiteId: prereqId,
        ...result
      });
      
      if (!result.isMet) {
        allMet = false;
      }
    }

    // Check custom prerequisite rules
    if (module.customPrerequisites) {
      for (const ruleId of module.customPrerequisites) {
        const result = this.checkCustomRule(ruleId, userProgress, { module });
        results.push({
          type: 'custom_rule',
          ruleId,
          ...result
        });
        
        if (!result.isMet) {
          allMet = false;
        }
      }
    }

    return {
      isMet: allMet,
      reason: allMet ? 'All prerequisites met' : 'Some prerequisites not met',
      details: results,
      moduleId
    };
  }

  /**
   * Check if prerequisites are met for an activity
   * @param {string} activityId - The activity ID to check
   * @param {Object} userProgress - User's progress data
   * @param {Object} options - Additional options
   * @returns {Object} - Result with isMet boolean and details
   */
  checkActivityPrerequisites(activityId, userProgress, options = {}) {
    const activity = options.activity || this.getActivity(activityId);
    
    if (!activity) {
      return {
        isMet: false,
        reason: 'Activity not found',
        details: []
      };
    }

    const results = [];
    let allMet = true;

    // Check activity prerequisites
    for (const prereqId of activity.prerequisites || []) {
      const result = this.checkActivityCompletion(prereqId, userProgress);
      results.push({
        type: 'activity_completion',
        prerequisiteId: prereqId,
        ...result
      });
      
      if (!result.isMet) {
        allMet = false;
      }
    }

    // Check score-based prerequisites
    if (activity.scorePrerequisites) {
      for (const scoreReq of activity.scorePrerequisites) {
        const result = this.checkScoreRequirement(scoreReq, userProgress);
        results.push({
          type: 'score_requirement',
          requirement: scoreReq,
          ...result
        });
        
        if (!result.isMet) {
          allMet = false;
        }
      }
    }

    return {
      isMet: allMet,
      reason: allMet ? 'All prerequisites met' : 'Some prerequisites not met',
      details: results,
      activityId
    };
  }

  /**
   * Check if a module is completed
   * @param {string} moduleId - The module ID to check
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkModuleCompletion(moduleId, userProgress) {
    const moduleProgress = userProgress.modules?.[moduleId];
    
    if (!moduleProgress) {
      return {
        isMet: false,
        reason: 'Module not started',
        progress: null
      };
    }

    const isCompleted = moduleProgress.status === 'completed';
    const hasMinScore = moduleProgress.score >= (moduleProgress.minPassingScore || 0.8);

    return {
      isMet: isCompleted && hasMinScore,
      reason: isCompleted 
        ? (hasMinScore ? 'Module completed with passing score' : 'Module completed but score too low')
        : 'Module not completed',
      progress: moduleProgress
    };
  }

  /**
   * Check if an activity is completed
   * @param {string} activityId - The activity ID to check
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkActivityCompletion(activityId, userProgress) {
    const activityProgress = userProgress.activities?.[activityId];
    
    if (!activityProgress) {
      return {
        isMet: false,
        reason: 'Activity not started',
        progress: null
      };
    }

    const isCompleted = activityProgress.status === 'completed';
    const hasMinScore = activityProgress.score >= (activityProgress.passingScore || 0.7);

    return {
      isMet: isCompleted && hasMinScore,
      reason: isCompleted 
        ? (hasMinScore ? 'Activity completed with passing score' : 'Activity completed but score too low')
        : 'Activity not completed',
      progress: activityProgress
    };
  }

  /**
   * Check a score requirement
   * @param {Object} scoreReq - The score requirement configuration
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkScoreRequirement(scoreReq, userProgress) {
    const { type, targetId, minScore, aggregationType = 'average' } = scoreReq;
    
    let actualScore = 0;
    let reason = '';

    if (type === 'module') {
      const moduleProgress = userProgress.modules?.[targetId];
      actualScore = moduleProgress?.score || 0;
      reason = `Module score: ${actualScore}, required: ${minScore}`;
    } else if (type === 'activity') {
      const activityProgress = userProgress.activities?.[targetId];
      actualScore = activityProgress?.score || 0;
      reason = `Activity score: ${actualScore}, required: ${minScore}`;
    } else if (type === 'category') {
      // Calculate aggregate score for a category
      actualScore = this.calculateCategoryScore(targetId, userProgress, aggregationType);
      reason = `Category ${aggregationType} score: ${actualScore}, required: ${minScore}`;
    }

    return {
      isMet: actualScore >= minScore,
      reason,
      actualScore,
      requiredScore: minScore
    };
  }

  /**
   * Check a custom prerequisite rule
   * @param {string} ruleId - The rule ID to check
   * @param {Object} userProgress - User's progress data
   * @param {Object} context - Additional context
   * @returns {Object} - Result with isMet boolean and details
   */
  checkCustomRule(ruleId, userProgress, context = {}) {
    const rule = this.rules.get(ruleId);
    
    if (!rule || !rule.isActive) {
      return {
        isMet: true,
        reason: 'Rule not found or inactive',
        ruleId
      };
    }

    // Check if there's a custom validator for this rule
    const validator = this.customValidators.get(ruleId);
    if (validator) {
      try {
        const result = validator(userProgress, context, rule);
        return {
          isMet: result.isMet || false,
          reason: result.reason || 'Custom validation',
          details: result.details || {},
          ruleId
        };
      } catch (error) {
        return {
          isMet: false,
          reason: `Custom validator error: ${error.message}`,
          ruleId
        };
      }
    }

    // Default rule checking based on rule type
    switch (rule.type) {
      case 'time_spent':
        return this.checkTimeSpentRule(rule, userProgress);
      
      case 'badge_earned':
        return this.checkBadgeRule(rule, userProgress);
      
      case 'streak':
        return this.checkStreakRule(rule, userProgress);
      
      default:
        return {
          isMet: true,
          reason: 'Unknown rule type, defaulting to met',
          ruleId
        };
    }
  }

  /**
   * Check time spent rule
   * @param {Object} rule - The rule configuration
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkTimeSpentRule(rule, userProgress) {
    const { minTimeSpent, targetType, targetId } = rule.conditions;
    let actualTimeSpent = 0;

    if (targetType === 'module') {
      actualTimeSpent = userProgress.modules?.[targetId]?.timeSpent || 0;
    } else if (targetType === 'activity') {
      actualTimeSpent = userProgress.activities?.[targetId]?.timeSpent || 0;
    }

    return {
      isMet: actualTimeSpent >= minTimeSpent,
      reason: `Time spent: ${actualTimeSpent}s, required: ${minTimeSpent}s`,
      actualTimeSpent,
      requiredTimeSpent: minTimeSpent
    };
  }

  /**
   * Check badge earned rule
   * @param {Object} rule - The rule configuration
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkBadgeRule(rule, userProgress) {
    const { badgeIds, minCount = 1 } = rule.conditions;
    const earnedBadges = userProgress.badges || [];
    
    const matchingBadges = earnedBadges.filter(badge => 
      badgeIds.includes(badge.id)
    );

    return {
      isMet: matchingBadges.length >= minCount,
      reason: `Earned ${matchingBadges.length} of required badges, need ${minCount}`,
      earnedCount: matchingBadges.length,
      requiredCount: minCount,
      matchingBadges
    };
  }

  /**
   * Check streak rule
   * @param {Object} rule - The rule configuration
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Result with isMet boolean and details
   */
  checkStreakRule(rule, userProgress) {
    const { minStreak, streakType } = rule.conditions;
    const currentStreak = userProgress.streaks?.[streakType] || 0;

    return {
      isMet: currentStreak >= minStreak,
      reason: `Current ${streakType} streak: ${currentStreak}, required: ${minStreak}`,
      currentStreak,
      requiredStreak: minStreak
    };
  }

  /**
   * Calculate aggregate score for a category
   * @param {string} category - The category to calculate for
   * @param {Object} userProgress - User's progress data
   * @param {string} aggregationType - How to aggregate (average, min, max, sum)
   * @returns {number} - The calculated score
   */
  calculateCategoryScore(category, userProgress, aggregationType = 'average') {
    const categoryScores = [];
    
    // Collect scores from modules in this category
    Object.values(userProgress.modules || {}).forEach(moduleProgress => {
      if (moduleProgress.category === category && moduleProgress.score !== undefined) {
        categoryScores.push(moduleProgress.score);
      }
    });

    if (categoryScores.length === 0) {
      return 0;
    }

    switch (aggregationType) {
      case 'average':
        return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
      case 'min':
        return Math.min(...categoryScores);
      case 'max':
        return Math.max(...categoryScores);
      case 'sum':
        return categoryScores.reduce((sum, score) => sum + score, 0);
      default:
        return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
    }
  }

  /**
   * Get detailed prerequisite information for a module
   * @param {string} moduleId - The module ID
   * @param {Object} userProgress - User's progress data
   * @returns {Object} - Detailed prerequisite information
   */
  getPrerequisiteDetails(moduleId, userProgress) {
    const result = this.checkModulePrerequisites(moduleId, userProgress);
    
    return {
      ...result,
      summary: {
        total: result.details.length,
        met: result.details.filter(d => d.isMet).length,
        unmet: result.details.filter(d => !d.isMet).length
      },
      nextSteps: this.getNextSteps(result.details.filter(d => !d.isMet))
    };
  }

  /**
   * Get suggested next steps for unmet prerequisites
   * @param {Array} unmetPrerequisites - Array of unmet prerequisite details
   * @returns {Array} - Array of suggested next steps
   */
  getNextSteps(unmetPrerequisites) {
    return unmetPrerequisites.map(prereq => {
      switch (prereq.type) {
        case 'module_completion':
          return {
            action: 'complete_module',
            targetId: prereq.prerequisiteId,
            description: `Complete the required module: ${prereq.prerequisiteId}`
          };
        case 'activity_completion':
          return {
            action: 'complete_activity',
            targetId: prereq.prerequisiteId,
            description: `Complete the required activity: ${prereq.prerequisiteId}`
          };
        case 'score_requirement':
          return {
            action: 'improve_score',
            targetId: prereq.requirement.targetId,
            description: `Improve your score to at least ${prereq.requirement.minScore}`
          };
        default:
          return {
            action: 'custom',
            description: prereq.reason
          };
      }
    });
  }

  // Placeholder methods for getting module/activity data
  // These would be implemented to fetch from your data source
  getModule(moduleId) {
    // Implementation would fetch module data
    return null;
  }

  getActivity(activityId) {
    // Implementation would fetch activity data
    return null;
  }
}

export default PrerequisiteChecker;