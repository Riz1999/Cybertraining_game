/**
 * Simulation Engine
 * 
 * This is the core engine that powers all simulations in the platform.
 * It integrates state management, event handling, and rendering.
 */
import { Simulation } from './models/SimulationModels';
import SimulationState from './state/SimulationState';
import EventSystem, { globalEventSystem } from './events/EventSystem';
import { createRenderer } from './rendering/SimulationRenderer';
import { SIMULATION_STATUS } from './models/SimulationTypes';

class SimulationEngine {
  /**
   * Create a new simulation engine
   * @param {Object} simulationData - The simulation data
   * @param {Object} options - Configuration options
   */
  constructor(simulationData, options = {}) {
    // Create the simulation model
    this.simulation = simulationData instanceof Simulation 
      ? simulationData 
      : new Simulation(simulationData);
    
    // Create the simulation state
    this.state = new SimulationState(options.initialState);
    
    // Create a scoped event system
    this.events = new EventSystem();
    
    // Create the renderer for this simulation type
    this.renderer = createRenderer(this.simulation.type);
    
    // Track if the simulation is initialized
    this.initialized = false;
    
    // Configuration options
    this.options = {
      autoStart: false,
      saveProgress: true,
      trackAnalytics: true,
      ...options
    };
  }

  /**
   * Initialize the simulation
   */
  initialize() {
    if (this.initialized) {
      return;
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Mark as initialized
    this.initialized = true;
    
    // Emit initialization event
    this.events.emit('simulation:initialized', this);
    globalEventSystem.emit('simulation:initialized', this);
    
    // Auto-start if configured
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Set up event listeners for the simulation
   */
  setupEventListeners() {
    // Example event listeners
    this.events.on('interaction:complete', this.handleInteractionComplete.bind(this));
    this.events.on('simulation:complete', this.handleSimulationComplete.bind(this));
    this.events.on('simulation:error', this.handleSimulationError.bind(this));
  }

  /**
   * Start the simulation
   */
  start() {
    if (!this.initialized) {
      this.initialize();
    }
    
    const startInteraction = this.simulation.getStartInteraction();
    
    if (!startInteraction) {
      this.handleSimulationError(new Error('No start interaction found'));
      return;
    }
    
    // Update state to start the simulation
    this.state.startSimulation(startInteraction.id);
    
    // Emit start event
    this.events.emit('simulation:start', this);
    globalEventSystem.emit('simulation:start', this);
  }

  /**
   * Pause the simulation
   */
  pause() {
    this.state.pauseSimulation();
    
    // Emit pause event
    this.events.emit('simulation:pause', this);
    globalEventSystem.emit('simulation:pause', this);
  }

  /**
   * Resume the simulation
   */
  resume() {
    this.state.resumeSimulation();
    
    // Emit resume event
    this.events.emit('simulation:resume', this);
    globalEventSystem.emit('simulation:resume', this);
  }

  /**
   * Reset the simulation to its initial state
   */
  reset() {
    // Create a new state
    this.state = new SimulationState();
    
    // Emit reset event
    this.events.emit('simulation:reset', this);
    globalEventSystem.emit('simulation:reset', this);
  }

  /**
   * Handle user input for the current interaction
   * @param {any} response - The user's response
   */
  handleUserInput(response) {
    const { currentInteractionId } = this.state.getState();
    
    if (!currentInteractionId) {
      this.handleSimulationError(new Error('No current interaction'));
      return;
    }
    
    const interaction = this.simulation.getInteraction(currentInteractionId);
    
    if (!interaction) {
      this.handleSimulationError(new Error(`Interaction not found: ${currentInteractionId}`));
      return;
    }
    
    // Evaluate the response
    const evaluation = interaction.evaluateResponse(response);
    
    // Complete the interaction
    this.completeInteraction(currentInteractionId, response, evaluation);
  }

  /**
   * Complete an interaction
   * @param {string} interactionId - The ID of the interaction to complete
   * @param {any} response - The user's response
   * @param {Object} evaluation - The evaluation of the response
   */
  completeInteraction(interactionId, response, evaluation) {
    const { points, feedback, nextInteractionId, isCorrect } = evaluation;
    
    // Update the state
    this.state.completeInteraction(interactionId, response, points, nextInteractionId);
    
    // Emit interaction complete event
    this.events.emit('interaction:complete', {
      interactionId,
      response,
      evaluation,
      state: this.state.getState()
    });
    
    // Check if we should move to the next interaction
    if (nextInteractionId) {
      // Emit next interaction event
      this.events.emit('interaction:next', {
        nextInteractionId,
        state: this.state.getState()
      });
    } else {
      // No next interaction, complete the simulation
      this.complete(isCorrect);
    }
  }

  /**
   * Complete the simulation
   * @param {boolean} success - Whether the simulation was completed successfully
   */
  complete(success = true) {
    // Update the state
    this.state.completeSimulation(success);
    
    // Emit complete event
    this.events.emit('simulation:complete', {
      success,
      state: this.state.getState()
    });
    globalEventSystem.emit('simulation:complete', {
      simulationId: this.simulation.id,
      success,
      state: this.state.getState()
    });
    
    // Save progress if configured
    if (this.options.saveProgress) {
      this.saveProgress();
    }
    
    // Track analytics if configured
    if (this.options.trackAnalytics) {
      this.trackAnalytics();
    }
  }

  /**
   * Handle simulation completion
   * @param {Object} data - Completion data
   */
  handleSimulationComplete(data) {
    console.log('Simulation completed:', data);
    // Additional handling can be added here
  }

  /**
   * Handle interaction completion
   * @param {Object} data - Completion data
   */
  handleInteractionComplete(data) {
    console.log('Interaction completed:', data);
    // Additional handling can be added here
  }

  /**
   * Handle simulation errors
   * @param {Error} error - The error that occurred
   */
  handleSimulationError(error) {
    console.error('Simulation error:', error);
    
    // Add the error to the state
    this.state.addError({
      message: error.message,
      stack: error.stack
    });
    
    // Emit error event
    this.events.emit('simulation:error', {
      error,
      state: this.state.getState()
    });
    globalEventSystem.emit('simulation:error', {
      simulationId: this.simulation.id,
      error,
      state: this.state.getState()
    });
  }

  /**
   * Save the simulation progress
   */
  saveProgress() {
    const state = this.state.getState();
    
    // In a real implementation, this would save to a backend API
    console.log('Saving simulation progress:', state);
    
    // Example implementation using localStorage
    try {
      localStorage.setItem(
        `simulation_progress_${this.simulation.id}`,
        JSON.stringify({
          simulationId: this.simulation.id,
          state: {
            status: state.status,
            score: state.score,
            history: state.history,
            timeSpent: state.timeSpent
          },
          timestamp: new Date().toISOString()
        })
      );
    } catch (error) {
      console.error('Error saving simulation progress:', error);
    }
  }

  /**
   * Track analytics for the simulation
   */
  trackAnalytics() {
    const state = this.state.getState();
    
    // In a real implementation, this would send analytics to a backend API
    console.log('Tracking simulation analytics:', state);
    
    // Example analytics data
    const analyticsData = {
      simulationId: this.simulation.id,
      simulationType: this.simulation.type,
      status: state.status,
      score: state.score,
      maxScore: this.simulation.maxScore,
      percentageScore: Math.round((state.score / this.simulation.maxScore) * 100),
      timeSpent: state.timeSpent,
      interactionsCompleted: state.history.length,
      timestamp: new Date().toISOString()
    };
    
    // Emit analytics event
    globalEventSystem.emit('analytics:simulation', analyticsData);
  }

  /**
   * Render the simulation
   * @returns {JSX.Element} - The rendered simulation
   */
  render() {
    // Create event handlers for the renderer
    const handlers = {
      handleOptionSelected: this.handleUserInput.bind(this),
      handlePause: this.pause.bind(this),
      handleResume: this.resume.bind(this),
      handleReset: this.reset.bind(this)
    };
    
    // Get the current state
    const state = this.state.getState();
    
    // Use the renderer to render the simulation
    return this.renderer(this.simulation, state, handlers);
  }

  /**
   * Get the current simulation state
   * @returns {Object} - The current state
   */
  getState() {
    return this.state.getState();
  }

  /**
   * Check if the simulation is complete
   * @returns {boolean} - Whether the simulation is complete
   */
  isComplete() {
    const { status } = this.state.getState();
    return status === SIMULATION_STATUS.COMPLETED;
  }

  /**
   * Check if the simulation is in progress
   * @returns {boolean} - Whether the simulation is in progress
   */
  isInProgress() {
    const { status } = this.state.getState();
    return status === SIMULATION_STATUS.IN_PROGRESS;
  }

  /**
   * Get the simulation score
   * @returns {number} - The current score
   */
  getScore() {
    const { score } = this.state.getState();
    return score;
  }

  /**
   * Get the simulation score as a percentage
   * @returns {number} - The score as a percentage
   */
  getScorePercentage() {
    const { score } = this.state.getState();
    return Math.round((score / this.simulation.maxScore) * 100);
  }

  /**
   * Clean up the simulation engine
   */
  destroy() {
    // Clear event listeners
    this.events.clear();
    
    // Emit destroy event
    globalEventSystem.emit('simulation:destroy', {
      simulationId: this.simulation.id
    });
  }
}

export default SimulationEngine;