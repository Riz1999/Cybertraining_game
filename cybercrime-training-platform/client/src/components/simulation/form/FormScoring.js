/**
 * Form Scoring System
 * 
 * This module provides scoring algorithms for form simulation components.
 */

/**
 * Calculate the overall score for a form simulation
 * @param {Object} params - Scoring parameters
 * @param {number} params.accuracy - Accuracy percentage (0-1)
 * @param {number} params.completionPercentage - Completion percentage (0-100)
 * @param {number} params.timeSpent - Time spent in seconds
 * @param {Object} params.formTemplate - The form template
 * @param {Object} params.weights - Scoring weights
 * @returns {Object} - Detailed scoring breakdown
 */
export const calculateFormScore = ({
  accuracy,
  completionPercentage,
  timeSpent,
  formTemplate,
  weights = {
    accuracy: 0.5,      // 50% weight for accuracy
    completion: 0.3,    // 30% weight for completion
    speed: 0.2          // 20% weight for speed
  }
}) => {
  // Calculate individual component scores
  const accuracyScore = accuracy * 100;
  const completionScore = completionPercentage;
  const speedScore = calculateSpeedScore(timeSpent, formTemplate);

  // Calculate weighted total score
  const totalScore = Math.round(
    (accuracyScore * weights.accuracy) +
    (completionScore * weights.completion) +
    (speedScore * weights.speed)
  );

  // Determine performance level
  const performanceLevel = getPerformanceLevel(totalScore);
  
  // Generate detailed feedback
  const feedback = generateDetailedFeedback({
    totalScore,
    accuracyScore,
    completionScore,
    speedScore,
    timeSpent,
    performanceLevel
  });

  return {
    totalScore: Math.max(0, Math.min(100, totalScore)),
    breakdown: {
      accuracy: Math.round(accuracyScore),
      completion: Math.round(completionScore),
      speed: Math.round(speedScore)
    },
    performanceLevel,
    feedback,
    timeSpent,
    weights
  };
};

/**
 * Calculate speed score based on time spent
 * @param {number} timeSpent - Time spent in seconds
 * @param {Object} formTemplate - The form template
 * @returns {number} - Speed score (0-100)
 */
const calculateSpeedScore = (timeSpent, formTemplate) => {
  const fieldCount = formTemplate.fields.length;
  
  // Estimate optimal time: 30 seconds per field + 2 minutes base time
  const optimalTime = (fieldCount * 30) + 120;
  
  // Maximum acceptable time: 3x optimal time
  const maxTime = optimalTime * 3;
  
  if (timeSpent <= optimalTime) {
    return 100; // Perfect speed score
  } else if (timeSpent >= maxTime) {
    return 0; // Minimum speed score
  } else {
    // Linear decrease between optimal and max time
    const ratio = (maxTime - timeSpent) / (maxTime - optimalTime);
    return Math.round(ratio * 100);
  }
};

/**
 * Determine performance level based on total score
 * @param {number} score - Total score (0-100)
 * @returns {string} - Performance level
 */
const getPerformanceLevel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Satisfactory';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

/**
 * Generate detailed feedback based on performance
 * @param {Object} params - Performance parameters
 * @returns {Object} - Detailed feedback
 */
const generateDetailedFeedback = ({
  totalScore,
  accuracyScore,
  completionScore,
  speedScore,
  timeSpent,
  performanceLevel
}) => {
  const feedback = {
    summary: '',
    strengths: [],
    weaknesses: [],
    recommendations: [],
    nextSteps: []
  };

  // Overall summary
  switch (performanceLevel) {
    case 'Excellent':
      feedback.summary = 'Outstanding performance! You have demonstrated excellent skills in form completion with high accuracy and efficiency.';
      break;
    case 'Very Good':
      feedback.summary = 'Very good performance! You show strong competency in form completion with minor areas for improvement.';
      break;
    case 'Good':
      feedback.summary = 'Good performance! You have solid basic skills with some areas that could benefit from practice.';
      break;
    case 'Satisfactory':
      feedback.summary = 'Satisfactory performance. You meet basic requirements but there is significant room for improvement.';
      break;
    case 'Needs Improvement':
      feedback.summary = 'Performance needs improvement. Focus on accuracy and efficiency in form completion.';
      break;
    case 'Poor':
      feedback.summary = 'Performance requires significant improvement. Additional training and practice are recommended.';
      break;
  }

  // Analyze strengths
  if (accuracyScore >= 80) {
    feedback.strengths.push('High accuracy in information placement');
  }
  if (completionScore >= 90) {
    feedback.strengths.push('Thorough completion of all form fields');
  }
  if (speedScore >= 80) {
    feedback.strengths.push('Efficient completion time');
  }

  // Analyze weaknesses
  if (accuracyScore < 70) {
    feedback.weaknesses.push('Low accuracy in matching information to correct fields');
    feedback.recommendations.push('Take more time to read field labels carefully');
    feedback.recommendations.push('Double-check information before placing it in fields');
  }
  if (completionScore < 80) {
    feedback.weaknesses.push('Incomplete form submission');
    feedback.recommendations.push('Review all form sections systematically');
    feedback.recommendations.push('Ensure all required fields are completed');
  }
  if (speedScore < 60) {
    feedback.weaknesses.push('Slow completion time');
    feedback.recommendations.push('Practice form completion to improve efficiency');
    feedback.recommendations.push('Familiarize yourself with common form layouts');
  }

  // Next steps based on performance level
  if (totalScore >= 80) {
    feedback.nextSteps.push('Continue practicing with more complex scenarios');
    feedback.nextSteps.push('Focus on maintaining consistency across different form types');
  } else if (totalScore >= 60) {
    feedback.nextSteps.push('Practice with similar form completion exercises');
    feedback.nextSteps.push('Review cybercrime reporting procedures');
  } else {
    feedback.nextSteps.push('Review basic form completion principles');
    feedback.nextSteps.push('Practice with simpler exercises before attempting complex forms');
    feedback.nextSteps.push('Seek additional training on cybercrime reporting procedures');
  }

  return feedback;
};

/**
 * Calculate field-level scoring for detailed analysis
 * @param {Object} formTemplate - The form template
 * @param {Object} formState - The current form state
 * @returns {Object} - Field-level scoring details
 */
export const calculateFieldScoring = (formTemplate, formState) => {
  const fieldScores = {};
  let totalPossiblePoints = 0;
  let earnedPoints = 0;

  formTemplate.fields.forEach(field => {
    const fieldState = formState[field.id];
    const points = field.points || 1; // Default 1 point per field
    totalPossiblePoints += points;

    let fieldScore = 0;
    let feedback = '';

    if (fieldState && fieldState.isFilled) {
      if (field.correctValue && fieldState.value === field.correctValue) {
        fieldScore = points;
        feedback = 'Correct';
      } else if (field.correctValue) {
        // Partial credit for close matches
        const similarity = calculateStringSimilarity(
          fieldState.value.toLowerCase(),
          field.correctValue.toLowerCase()
        );
        if (similarity > 0.8) {
          fieldScore = points * 0.7; // 70% credit for close match
          feedback = 'Close match';
        } else {
          fieldScore = 0;
          feedback = 'Incorrect';
        }
      } else {
        fieldScore = points; // No correct answer defined, give full credit for completion
        feedback = 'Completed';
      }
    } else {
      fieldScore = 0;
      feedback = field.isRequired ? 'Required field not completed' : 'Not completed';
    }

    earnedPoints += fieldScore;
    fieldScores[field.id] = {
      score: fieldScore,
      maxScore: points,
      feedback,
      isCorrect: fieldScore === points
    };
  });

  return {
    fieldScores,
    totalScore: totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 0,
    earnedPoints,
    totalPossiblePoints
  };
};

/**
 * Calculate string similarity for partial credit scoring
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score (0-1)
 */
const calculateStringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export default {
  calculateFormScore,
  calculateFieldScoring,
  getPerformanceLevel
};