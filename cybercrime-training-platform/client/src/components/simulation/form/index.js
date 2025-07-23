/**
 * Form Simulation Components
 * 
 * This module exports all form simulation components for easy importing.
 */

export { default as FormSimulationContainer } from './FormSimulationContainer';
export { default as FormRenderer } from './FormRenderer';
export { default as FormField } from './FormField';
export { default as DraggableInfoPanel } from './DraggableInfoPanel';
export { default as DraggableItem } from './DraggableItem';
export { default as NCRPFormSimulation } from './NCRPFormSimulation';

// Utilities
export { default as FormValidation } from './FormValidation';
export { default as FormScoring } from './FormScoring';

// Re-export specific functions for convenience
export {
  validateField,
  validateForm,
  calculateCompletionPercentage,
  calculateAccuracy,
  generateFeedback
} from './FormValidation';

export {
  calculateFormScore,
  calculateFieldScoring,
  getPerformanceLevel
} from './FormScoring';