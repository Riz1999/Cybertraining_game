/**
 * Simulation State Management
 * 
 * This module provides a state management system for simulations,
 * handling the current state, transitions, and history.
 */
import { SIMULATION_STATUS } from '../models/SimulationTypes';

class SimulationState {
  constructor(initialState = {}) {
    this.state = {
      status: SIMULATION_STATUS.NOT_STARTED,
      currentInteractionId: null,
      history: [],
      userResponses: {},
      score: 0,
      startTime: null,
      endTime: null,
      timeSpent: 0,
      errors: [],
      ...initialState
    };
    
    // For tracking state changes and enabling undo/redo functionality
    this.stateHistory = [];
    this.currentHistoryIndex = -1;
    
    // Save initial state to history
    this.saveStateToHistory();
  }

  /**
   * Get the current simulation state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update the simulation state
   * @param {Object} updates - The state updates to apply
   */
  updateState(updates) {
    this.state = {
      ...this.state,
      ...updates
    };
    
    // Save the new state to history
    this.saveStateToHistory();
    
    return this.state;
  }

  /**
   * Start the simulation
   */
  startSimulation(firstInteractionId) {
    const now = new Date();
    return this.updateState({
      status: SIMULATION_STATUS.IN_PROGRESS,
      startTime: now,
      currentInteractionId: firstInteractionId
    });
  }

  /**
   * Complete the current interaction and move to the next
   * @param {string} interactionId - The current interaction ID
   * @param {any} response - The user's response
   * @param {number} points - Points earned for this interaction
   * @param {string} nextInteractionId - The next interaction to move to
   */
  completeInteraction(interactionId, response, points = 0, nextInteractionId = null) {
    const history = [...this.state.history, {
      interactionId,
      response,
      timestamp: new Date(),
      points
    }];
    
    const userResponses = {
      ...this.state.userResponses,
      [interactionId]: response
    };
    
    const score = this.state.score + points;
    
    return this.updateState({
      history,
      userResponses,
      score,
      currentInteractionId: nextInteractionId
    });
  }

  /**
   * Complete the simulation
   * @param {boolean} success - Whether the simulation was completed successfully
   */
  completeSimulation(success = true) {
    const now = new Date();
    const timeSpent = now - this.state.startTime;
    
    return this.updateState({
      status: success ? SIMULATION_STATUS.COMPLETED : SIMULATION_STATUS.FAILED,
      endTime: now,
      timeSpent
    });
  }

  /**
   * Pause the simulation
   */
  pauseSimulation() {
    return this.updateState({
      status: SIMULATION_STATUS.PAUSED
    });
  }

  /**
   * Resume the simulation
   */
  resumeSimulation() {
    return this.updateState({
      status: SIMULATION_STATUS.IN_PROGRESS
    });
  }

  /**
   * Add an error to the simulation state
   * @param {Object} error - The error to add
   */
  addError(error) {
    const errors = [...this.state.errors, {
      ...error,
      timestamp: new Date()
    }];
    
    return this.updateState({ errors });
  }

  /**
   * Save the current state to history
   */
  saveStateToHistory() {
    // Remove any future states if we're in the middle of the history
    if (this.currentHistoryIndex < this.stateHistory.length - 1) {
      this.stateHistory = this.stateHistory.slice(0, this.currentHistoryIndex + 1);
    }
    
    // Add current state to history
    this.stateHistory.push(JSON.parse(JSON.stringify(this.state)));
    this.currentHistoryIndex = this.stateHistory.length - 1;
    
    // Limit history size to prevent memory issues
    const maxHistorySize = 50;
    if (this.stateHistory.length > maxHistorySize) {
      this.stateHistory = this.stateHistory.slice(-maxHistorySize);
      this.currentHistoryIndex = this.stateHistory.length - 1;
    }
  }

  /**
   * Undo the last state change
   */
  undo() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.state = JSON.parse(JSON.stringify(this.stateHistory[this.currentHistoryIndex]));
      return true;
    }
    return false;
  }

  /**
   * Redo a previously undone state change
   */
  redo() {
    if (this.currentHistoryIndex < this.stateHistory.length - 1) {
      this.currentHistoryIndex++;
      this.state = JSON.parse(JSON.stringify(this.stateHistory[this.currentHistoryIndex]));
      return true;
    }
    return false;
  }
}

export default SimulationState;