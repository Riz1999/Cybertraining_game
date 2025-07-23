/**
 * Timer Simulation Components
 * 
 * This module exports all timer-related components for timed challenges and simulations.
 */

export { default as CountdownTimer } from './CountdownTimer';
export { default as TimePressureIndicator, TimePressureBar, TimePressurePulse } from './TimePressureIndicator';
export { default as TimerResultAnimation } from './TimerResultAnimation';
export { default as TimedChallengeContainer } from './TimedChallengeContainer';
export { default as TimedChallengeExample } from './TimedChallengeExample';

// Utilities
export { default as TimerScoring } from './TimerScoring';
export {
  calculateTimerScore,
  calculateTimeBonus,
  analyzeTimePressurePerformance,
  getTimePressureIndicators
} from './TimerScoring';