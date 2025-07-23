/**
 * Dialog System Types
 * 
 * This file defines the types and constants used in the dialog system.
 */

// Dialog message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
  TEXT_WITH_AUDIO: 'text_with_audio',
  SYSTEM: 'system',
  OPTIONS: 'options'
};

// Dialog participant types
export const PARTICIPANT_TYPES = {
  SYSTEM: 'system',
  USER: 'user',
  CHARACTER: 'character'
};

// Emotional states for characters
export const EMOTIONAL_STATES = {
  NEUTRAL: 'neutral',
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  CONFUSED: 'confused',
  SCARED: 'scared',
  SURPRISED: 'surprised',
  DISTRESSED: 'distressed',
  CALM: 'calm',
  FRUSTRATED: 'frustrated'
};

// Communication quality metrics
export const COMMUNICATION_METRICS = {
  EMPATHY: 'empathy',
  CLARITY: 'clarity',
  PROFESSIONALISM: 'professionalism',
  ACCURACY: 'accuracy',
  PATIENCE: 'patience'
};

// Dialog flow control types
export const FLOW_CONTROL = {
  CONTINUE: 'continue',
  BRANCH: 'branch',
  END: 'end'
};

export default {
  MESSAGE_TYPES,
  PARTICIPANT_TYPES,
  EMOTIONAL_STATES,
  COMMUNICATION_METRICS,
  FLOW_CONTROL
};