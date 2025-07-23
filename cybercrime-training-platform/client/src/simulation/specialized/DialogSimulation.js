/**
 * Dialog Simulation
 * 
 * This module extends the core simulation framework to provide specialized
 * functionality for dialog-based simulations.
 */
import SimulationEngine from '../SimulationEngine';
import { SIMULATION_TYPES, INTERACTION_TYPES } from '../models/SimulationTypes';
import { CommunicationScoring } from '../../components/simulation/dialog/CommunicationScoring';

class DialogSimulation extends SimulationEngine {
  /**
   * Create a new dialog simulation
   * @param {Object} simulationData - The simulation data
   * @param {Object} options - Configuration options
   */
  constructor(simulationData, options = {}) {
    // Ensure the simulation type is set to dialog
    const dialogSimulationData = {
      ...simulationData,
      type: SIMULATION_TYPES.DIALOG
    };
    
    super(dialogSimulationData, options);
    
    // Dialog-specific state
    this.dialogHistory = [];
    this.currentCharacter = null;
    this.communicationScores = {};
    
    // Dialog-specific options
    this.dialogOptions = {
      enableAudio: true,
      enableTypingEffect: true,
      enableCommunicationScoring: true,
      ...options.dialogOptions
    };
  }
  
  /**
   * Start the dialog simulation
   */
  start() {
    super.start();
    
    // Initialize dialog history
    this.dialogHistory = [];
    
    // Set the current character if available
    this.updateCurrentCharacter();
  }
  
  /**
   * Update the current character based on the current interaction
   */
  updateCurrentCharacter() {
    const { currentInteractionId } = this.state.getState();
    
    if (!currentInteractionId) {
      this.currentCharacter = null;
      return;
    }
    
    const interaction = this.simulation.getInteraction(currentInteractionId);
    
    if (!interaction) {
      this.currentCharacter = null;
      return;
    }
    
    // Check if the interaction has a character ID
    if (interaction.metadata && interaction.metadata.characterId) {
      const characterId = interaction.metadata.characterId;
      
      // Find the character in the scenario
      this.currentCharacter = this.simulation.scenario.characters.find(
        char => char.id === characterId
      ) || null;
    } else {
      this.currentCharacter = null;
    }
    
    // Emit character change event
    this.events.emit('dialog:character_change', {
      character: this.currentCharacter,
      interaction: interaction
    });
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
    
    // Add the user's response to the dialog history
    this.addToDialogHistory({
      isUser: true,
      text: typeof response === 'string' ? response : JSON.stringify(response),
      timestamp: new Date()
    });
    
    // Score the communication quality if enabled
    if (this.dialogOptions.enableCommunicationScoring && 
        typeof response === 'string' && 
        interaction.type === INTERACTION_TYPES.TEXT_RESPONSE) {
      
      const context = {
        emotionalState: this.currentCharacter ? this.currentCharacter.emotionalState : null,
        interactionType: interaction.type,
        interactionId: currentInteractionId
      };
      
      const scores = CommunicationScoring.scoreText(response, context);
      
      // Store the scores
      this.communicationScores[currentInteractionId] = scores;
      
      // Emit scoring event
      this.events.emit('dialog:communication_scored', {
        interactionId: currentInteractionId,
        scores
      });
      
      // Add communication quality points to the response evaluation
      const baseEvaluation = interaction.evaluateResponse(response);
      const communicationPoints = Math.round(scores.overall / 2); // Scale from 0-10 to 0-5
      
      // Create enhanced evaluation with communication scoring
      const enhancedEvaluation = {
        ...baseEvaluation,
        points: baseEvaluation.points + communicationPoints,
        communicationScores: scores
      };
      
      // Complete the interaction with the enhanced evaluation
      this.completeInteraction(currentInteractionId, response, enhancedEvaluation);
      return;
    }
    
    // For non-text responses or when scoring is disabled, use the standard evaluation
    super.handleUserInput(response);
  }
  
  /**
   * Complete an interaction
   * @param {string} interactionId - The ID of the interaction to complete
   * @param {any} response - The user's response
   * @param {Object} evaluation - The evaluation of the response
   */
  completeInteraction(interactionId, response, evaluation) {
    super.completeInteraction(interactionId, response, evaluation);
    
    // Get the next interaction
    const { nextInteractionId } = evaluation;
    
    if (nextInteractionId) {
      const nextInteraction = this.simulation.getInteraction(nextInteractionId);
      
      if (nextInteraction && nextInteraction.metadata && nextInteraction.metadata.characterId) {
        // Add the character's dialog to the history
        this.addToDialogHistory({
          characterId: nextInteraction.metadata.characterId,
          text: nextInteraction.prompt,
          timestamp: new Date()
        });
      }
      
      // Update the current character
      this.updateCurrentCharacter();
    }
  }
  
  /**
   * Add an entry to the dialog history
   * @param {Object} entry - The dialog entry to add
   */
  addToDialogHistory(entry) {
    this.dialogHistory.push(entry);
    
    // Emit dialog history update event
    this.events.emit('dialog:history_update', {
      history: this.dialogHistory
    });
  }
  
  /**
   * Get the dialog history
   * @returns {Array} - The dialog history
   */
  getDialogHistory() {
    return [...this.dialogHistory];
  }
  
  /**
   * Get the current character
   * @returns {Object|null} - The current character, or null if none
   */
  getCurrentCharacter() {
    return this.currentCharacter;
  }
  
  /**
   * Get all characters in the simulation
   * @returns {Array} - The characters
   */
  getCharacters() {
    return this.simulation.scenario.characters || [];
  }
  
  /**
   * Get the communication scores for an interaction
   * @param {string} interactionId - The ID of the interaction
   * @returns {Object|null} - The communication scores, or null if none
   */
  getCommunicationScores(interactionId) {
    return this.communicationScores[interactionId] || null;
  }
  
  /**
   * Get all communication scores
   * @returns {Object} - All communication scores
   */
  getAllCommunicationScores() {
    return { ...this.communicationScores };
  }
  
  /**
   * Reset the dialog simulation
   */
  reset() {
    super.reset();
    
    // Reset dialog-specific state
    this.dialogHistory = [];
    this.currentCharacter = null;
    this.communicationScores = {};
  }
}

export default DialogSimulation;