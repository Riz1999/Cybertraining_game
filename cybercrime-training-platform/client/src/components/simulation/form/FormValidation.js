/**
 * Form Validation Utilities
 * 
 * This module provides validation functions for form simulation components.
 */

/**
 * Validate a single form field
 * @param {Object} field - The field configuration
 * @param {string} value - The field value
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateField = (field, value) => {
  const result = {
    isValid: true,
    error: null
  };

  // Check if required field is empty
  if (field.isRequired && (!value || value.trim() === '')) {
    result.isValid = false;
    result.error = `${field.label} is required`;
    return result;
  }

  // Skip validation if field is empty and not required
  if (!value || value.trim() === '') {
    return result;
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      if (!isValidEmail(value)) {
        result.isValid = false;
        result.error = 'Please enter a valid email address';
      }
      break;

    case 'tel':
      if (!isValidPhone(value)) {
        result.isValid = false;
        result.error = 'Please enter a valid phone number';
      }
      break;

    case 'number':
      if (!isValidNumber(value)) {
        result.isValid = false;
        result.error = 'Please enter a valid number';
      }
      break;

    case 'date':
      if (!isValidDate(value)) {
        result.isValid = false;
        result.error = 'Please enter a valid date';
      }
      break;

    case 'time':
      if (!isValidTime(value)) {
        result.isValid = false;
        result.error = 'Please enter a valid time';
      }
      break;

    default:
      // No specific validation for other types
      break;
  }

  return result;
};

/**
 * Validate an entire form
 * @param {Object} formTemplate - The form template
 * @param {Object} formState - The current form state
 * @returns {Object} - Validation result with errors object and overall validity
 */
export const validateForm = (formTemplate, formState) => {
  const errors = {};
  let isValid = true;

  formTemplate.fields.forEach(field => {
    const fieldValue = formState[field.id]?.value || '';
    const validation = validateField(field, fieldValue);
    
    if (!validation.isValid) {
      errors[field.id] = validation.error;
      isValid = false;
    }
  });

  return {
    isValid,
    errors
  };
};

/**
 * Calculate form completion percentage
 * @param {Object} formTemplate - The form template
 * @param {Object} formState - The current form state
 * @returns {number} - Completion percentage (0-100)
 */
export const calculateCompletionPercentage = (formTemplate, formState) => {
  const totalFields = formTemplate.fields.length;
  
  if (totalFields === 0) return 100;
  
  const filledFields = formTemplate.fields.filter(field => {
    const fieldState = formState[field.id];
    return fieldState && fieldState.isFilled && fieldState.value.trim() !== '';
  }).length;
  
  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Calculate form accuracy score
 * @param {Object} formTemplate - The form template
 * @param {Object} formState - The current form state
 * @returns {Object} - Accuracy details with score, correct count, and total count
 */
export const calculateAccuracy = (formTemplate, formState) => {
  let correctCount = 0;
  let totalCount = 0;
  const fieldAccuracy = {};

  formTemplate.fields.forEach(field => {
    if (field.correctValue !== undefined) {
      totalCount++;
      const fieldValue = formState[field.id]?.value || '';
      const isCorrect = fieldValue.trim().toLowerCase() === field.correctValue.toLowerCase();
      
      if (isCorrect) {
        correctCount++;
      }
      
      fieldAccuracy[field.id] = {
        isCorrect,
        expected: field.correctValue,
        actual: fieldValue
      };
    }
  });

  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;

  return {
    accuracy,
    correctCount,
    totalCount,
    fieldAccuracy
  };
};

/**
 * Generate feedback based on form performance
 * @param {Object} performance - Performance metrics
 * @returns {Object} - Feedback with suggestions and areas for improvement
 */
export const generateFeedback = (performance) => {
  const { accuracy, completionPercentage, timeSpent } = performance;
  const feedback = {
    overall: '',
    strengths: [],
    improvements: [],
    suggestions: []
  };

  // Overall performance assessment
  if (accuracy >= 0.9 && completionPercentage >= 90) {
    feedback.overall = 'Excellent performance! You have demonstrated strong skills in form completion.';
    feedback.strengths.push('High accuracy in information placement');
    feedback.strengths.push('Complete form submission');
  } else if (accuracy >= 0.7 && completionPercentage >= 70) {
    feedback.overall = 'Good performance with room for improvement.';
    feedback.strengths.push('Reasonable accuracy in most fields');
  } else {
    feedback.overall = 'Performance needs improvement. Focus on accuracy and completeness.';
  }

  // Accuracy feedback
  if (accuracy < 0.7) {
    feedback.improvements.push('Improve accuracy in matching information to correct fields');
    feedback.suggestions.push('Take time to read field labels carefully');
    feedback.suggestions.push('Double-check information before placing it in fields');
  }

  // Completion feedback
  if (completionPercentage < 80) {
    feedback.improvements.push('Complete all required form fields');
    feedback.suggestions.push('Review the form systematically to ensure no fields are missed');
  }

  // Time feedback
  if (timeSpent > 600) { // More than 10 minutes
    feedback.improvements.push('Work on completing forms more efficiently');
    feedback.suggestions.push('Practice form completion to improve speed');
  } else if (timeSpent < 120) { // Less than 2 minutes
    feedback.suggestions.push('Take adequate time to ensure accuracy');
  }

  return feedback;
};

// Helper validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Indian phone number format
  const phoneRegex = /^(\+91[-\s]?)?[0]?(91)?[6789]\d{9}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

const isValidNumber = (number) => {
  return !isNaN(number) && !isNaN(parseFloat(number));
};

const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

const isValidTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export default {
  validateField,
  validateForm,
  calculateCompletionPercentage,
  calculateAccuracy,
  generateFeedback
};