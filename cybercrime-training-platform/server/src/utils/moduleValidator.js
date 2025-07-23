/**
 * Module content validator utility
 */

/**
 * Validate module content based on activity type
 * @param {string} activityType - Type of activity
 * @param {Object} content - Activity content
 * @returns {boolean} Validation result
 */
const validateModuleContent = (activityType, content) => {
  if (!content || typeof content !== 'object') {
    return false;
  }

  switch (activityType) {
    case 'quiz':
      return validateQuizContent(content);
    case 'simulation':
      return validateSimulationContent(content);
    case 'roleplay':
      return validateRoleplayContent(content);
    case 'dragdrop':
      return validateDragDropContent(content);
    case 'interactive':
      return validateInteractiveContent(content);
    default:
      return false;
  }
};

/**
 * Validate quiz content
 * @param {Object} content - Quiz content
 * @returns {boolean} Validation result
 */
const validateQuizContent = (content) => {
  if (!content.questions || !Array.isArray(content.questions) || content.questions.length === 0) {
    return false;
  }

  for (const question of content.questions) {
    if (!question.text || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
      return false;
    }

    // Check if at least one option is correct
    const hasCorrectOption = question.options.some(option => option.isCorrect === true);
    if (!hasCorrectOption) {
      return false;
    }
  }

  return true;
};

/**
 * Validate simulation content
 * @param {Object} content - Simulation content
 * @returns {boolean} Validation result
 */
const validateSimulationContent = (content) => {
  if (!content.type || !content.scenario || !content.steps || !Array.isArray(content.steps)) {
    return false;
  }

  return true;
};

/**
 * Validate roleplay content
 * @param {Object} content - Roleplay content
 * @returns {boolean} Validation result
 */
const validateRoleplayContent = (content) => {
  if (!content.type || !content.scenario || !content.characters || !Array.isArray(content.characters)) {
    return false;
  }

  if (!content.dialog || !Array.isArray(content.dialog) || content.dialog.length === 0) {
    return false;
  }

  return true;
};

/**
 * Validate drag and drop content
 * @param {Object} content - Drag and drop content
 * @returns {boolean} Validation result
 */
const validateDragDropContent = (content) => {
  if (!content.type || !content.items || !Array.isArray(content.items) || content.items.length === 0) {
    return false;
  }

  if (!content.categories || !Array.isArray(content.categories) || content.categories.length === 0) {
    return false;
  }

  // Check if all items have valid categories
  for (const item of content.items) {
    if (!item.id || !item.text || !item.category) {
      return false;
    }

    if (!content.categories.includes(item.category)) {
      return false;
    }
  }

  return true;
};

/**
 * Validate interactive content
 * @param {Object} content - Interactive content
 * @returns {boolean} Validation result
 */
const validateInteractiveContent = (content) => {
  if (!content.type) {
    return false;
  }

  switch (content.type) {
    case 'avatar_dialog':
      return !!content.avatar && !!content.dialog && Array.isArray(content.dialog);
    case 'clickable_map':
      return !!content.mapImage && !!content.clickableAreas && Array.isArray(content.clickableAreas);
    case 'timeline':
      return !!content.events && Array.isArray(content.events);
    default:
      return false;
  }
};

module.exports = {
  validateModuleContent,
};