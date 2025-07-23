/**
 * Timer Scoring Utilities
 * 
 * Functions for calculating scores in timed challenges based on time used,
 * accuracy, and completion status.
 */

/**
 * Calculate score for a timed challenge
 * 
 * @param {Object} params - Scoring parameters
 * @param {number} params.timeLimit - Time limit in seconds
 * @param {number} params.timeUsed - Time used in seconds
 * @param {number} params.accuracy - Accuracy score (0-1)
 * @param {boolean} params.completed - Whether the challenge was completed
 * @param {Object} params.weights - Custom scoring weights
 * @returns {Object} Scoring data
 */
export const calculateTimerScore = ({
  timeLimit,
  timeUsed,
  accuracy = 1,
  completed = true,
  weights = {
    completion: 0.4,
    speed: 0.4,
    accuracy: 0.2
  }
}) => {
  // Normalize weights
  const totalWeight = weights.completion + weights.speed + weights.accuracy;
  const normalizedWeights = {
    completion: weights.completion / totalWeight,
    speed: weights.speed / totalWeight,
    accuracy: weights.accuracy / totalWeight
  };

  // Calculate completion score
  const completionScore = completed ? 100 : Math.min(50, Math.round((timeUsed / timeLimit) * 100));
  
  // Calculate speed score
  let speedScore = 0;
  if (completed) {
    // Higher score for faster completion
    const timeRatio = timeUsed / timeLimit;
    if (timeRatio <= 0.5) {
      // Completed in half the time or less: 100%
      speedScore = 100;
    } else if (timeRatio >= 1) {
      // Used all the time: 70%
      speedScore = 70;
    } else {
      // Linear scale between 70-100% for time ratio 0.5-1.0
      speedScore = Math.round(100 - (timeRatio - 0.5) * 60);
    }
  } else {
    // Partial score for incomplete challenges
    speedScore = Math.max(0, Math.round(50 - (timeUsed / timeLimit) * 50));
  }
  
  // Calculate accuracy score
  const accuracyScore = Math.round(accuracy * 100);
  
  // Calculate weighted total score
  const totalScore = Math.round(
    (completionScore * normalizedWeights.completion) +
    (speedScore * normalizedWeights.speed) +
    (accuracyScore * normalizedWeights.accuracy)
  );
  
  return {
    completionScore,
    speedScore,
    accuracyScore,
    totalScore,
    timeUsed,
    timeLimit,
    completed,
    weights: normalizedWeights
  };
};

/**
 * Calculate time bonus for fast completion
 * 
 * @param {number} timeLimit - Time limit in seconds
 * @param {number} timeUsed - Time used in seconds
 * @param {number} baseScore - Base score before bonus
 * @returns {Object} Bonus data
 */
export const calculateTimeBonus = (timeLimit, timeUsed, baseScore) => {
  // Only award bonus if completed in less than 70% of the time limit
  const timeRatio = timeUsed / timeLimit;
  
  if (timeRatio > 0.7) {
    return {
      hadBonus: false,
      bonusPoints: 0,
      bonusPercentage: 0,
      finalScore: baseScore
    };
  }
  
  // Calculate bonus percentage (max 30% bonus for completing in 40% of time or less)
  let bonusPercentage = 0;
  if (timeRatio <= 0.4) {
    bonusPercentage = 30;
  } else {
    // Linear scale from 0-30% for time ratio 0.7-0.4
    bonusPercentage = Math.round((0.7 - timeRatio) * 100);
  }
  
  const bonusPoints = Math.round((baseScore * bonusPercentage) / 100);
  const finalScore = baseScore + bonusPoints;
  
  return {
    hadBonus: true,
    bonusPoints,
    bonusPercentage,
    finalScore
  };
};

/**
 * Calculate urgency level based on remaining time
 * 
 * @param {number} timeLeft - Time left in seconds
 * @param {number} totalTime - Total time in seconds
 * @returns {string} Urgency level: 'normal', 'warning', 'critical'
 */
export const calculateUrgencyLevel = (timeLeft, totalTime) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  if (percentage <= 10) {
    return 'critical';
  } else if (percentage <= 30) {
    return 'warning';
  } else {
    return 'normal';
  }
};

export default {
  calculateTimerScore,
  calculateTimeBonus,
  calculateUrgencyLevel
};