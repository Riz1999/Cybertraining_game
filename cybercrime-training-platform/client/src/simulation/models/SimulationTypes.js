/**
 * Simulation Types
 * 
 * This file defines the core types and interfaces for the simulation framework.
 * These types are used throughout the simulation engine to ensure consistency.
 */

// Simulation types supported by the platform
export const SIMULATION_TYPES = {
  DIALOG: 'dialog',
  FORM: 'form',
  MAP: 'map',
  DECISION: 'decision',
  TIMER: 'timer',
  QUIZ: 'quiz',
  DRAG_DROP: 'dragdrop',
  INTERACTIVE: 'interactive'
};

// Interaction types that can occur within simulations
export const INTERACTION_TYPES = {
  TEXT_RESPONSE: 'text_response',
  MULTIPLE_CHOICE: 'multiple_choice',
  DRAG_DROP: 'drag_drop',
  FORM_FILL: 'form_fill',
  MAP_SELECTION: 'map_selection',
  TIMER_CHALLENGE: 'timer_challenge',
  DECISION_POINT: 'decision_point',
  CLICK_INTERACTION: 'click_interaction',
  DECISION_TREE: 'decision_tree'
};

// Status values for simulation progress
export const SIMULATION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PAUSED: 'paused'
};