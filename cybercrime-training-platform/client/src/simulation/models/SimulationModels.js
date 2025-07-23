/**
 * Simulation Data Models
 * 
 * This file defines the core data models for the simulation framework.
 */
import { SIMULATION_TYPES, INTERACTION_TYPES } from './SimulationTypes';

/**
 * Generate a UUID - fallback for environments without crypto.randomUUID
 */
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation for test environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Base class for all simulation models
 */
export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || generateUUID();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Represents a character in a simulation
 */
export class Character extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.role = data.role || '';
    this.description = data.description || '';
    this.avatarUrl = data.avatarUrl || '';
    this.emotionalState = data.emotionalState || 'neutral';
    this.traits = data.traits || [];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      role: this.role,
      description: this.description,
      avatarUrl: this.avatarUrl,
      emotionalState: this.emotionalState,
      traits: this.traits
    };
  }
}

/**
 * Represents an interaction option in a simulation
 */
export class InteractionOption extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.text = data.text || '';
    this.value = data.value || '';
    this.points = data.points || 0;
    this.feedback = data.feedback || '';
    this.isCorrect = data.isCorrect || false;
    this.nextInteractionId = data.nextInteractionId || null;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      value: this.value,
      points: this.points,
      feedback: this.feedback,
      isCorrect: this.isCorrect,
      nextInteractionId: this.nextInteractionId
    };
  }
}

/**
 * Represents an interaction in a simulation
 */
export class Interaction extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.type = data.type || INTERACTION_TYPES.TEXT_RESPONSE;
    this.prompt = data.prompt || '';
    this.options = (data.options || []).map(opt =>
      opt instanceof InteractionOption ? opt : new InteractionOption(opt)
    );
    this.correctResponse = data.correctResponse || null;
    this.timeLimit = data.timeLimit || null;
    this.points = data.points || 0;
    this.nextInteractionId = data.nextInteractionId || null;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      prompt: this.prompt,
      options: this.options.map(opt => opt.toJSON()),
      correctResponse: this.correctResponse,
      timeLimit: this.timeLimit,
      points: this.points,
      nextInteractionId: this.nextInteractionId,
      metadata: this.metadata
    };
  }

  /**
   * Evaluate a user response to this interaction
   * @param {any} response - The user's response
   * @returns {Object} - Evaluation result with points, feedback, and next interaction
   */
  evaluateResponse(response) {
    let points = 0;
    let feedback = '';
    let nextInteractionId = this.nextInteractionId;
    let isCorrect = false;

    switch (this.type) {
      case INTERACTION_TYPES.MULTIPLE_CHOICE: {
        const selectedOption = this.options.find(opt => opt.value === response);
        if (selectedOption) {
          points = selectedOption.points;
          feedback = selectedOption.feedback;
          nextInteractionId = selectedOption.nextInteractionId || nextInteractionId;
          isCorrect = selectedOption.isCorrect;
        }
        break;
      }

      case INTERACTION_TYPES.TEXT_RESPONSE: {
        // Simple exact match for text responses
        isCorrect = response === this.correctResponse;
        points = isCorrect ? this.points : 0;
        break;
      }

      case INTERACTION_TYPES.DRAG_DROP: {
        // For drag-drop, response should be an array of placements
        // Compare with correctResponse which is also an array
        if (Array.isArray(response) && Array.isArray(this.correctResponse)) {
          const correctCount = response.filter((item, index) =>
            item === this.correctResponse[index]
          ).length;

          const percentCorrect = correctCount / this.correctResponse.length;
          points = Math.round(this.points * percentCorrect);
          isCorrect = percentCorrect === 1;
        }
        break;
      }

      // Add more evaluation logic for other interaction types

      default:
        // Default evaluation logic
        isCorrect = response === this.correctResponse;
        points = isCorrect ? this.points : 0;
    }

    return {
      points,
      feedback,
      nextInteractionId,
      isCorrect
    };
  }
}

/**
 * Represents an outcome in a simulation
 */
export class Outcome extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.condition = data.condition || '';
    this.feedback = data.feedback || '';
    this.points = data.points || 0;
    this.nextInteractionId = data.nextInteractionId || null;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      condition: this.condition,
      feedback: this.feedback,
      points: this.points,
      nextInteractionId: this.nextInteractionId
    };
  }

  /**
   * Evaluate if this outcome's condition is met
   * @param {Object} context - The context to evaluate the condition against
   * @returns {boolean} - Whether the condition is met
   */
  evaluateCondition(context) {
    try {
      // Create a function from the condition string
      const conditionFn = new Function('context', `return ${this.condition}`);
      return conditionFn(context);
    } catch (error) {
      console.error('Error evaluating outcome condition:', error);
      return false;
    }
  }
}

/**
 * Represents an asset in a simulation
 */
export class Asset extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.type = data.type || 'image';
    this.url = data.url || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      url: this.url,
      name: this.name,
      description: this.description,
      metadata: this.metadata
    };
  }
}

/**
 * Represents a scenario in a simulation
 */
export class Scenario extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.context = data.context || '';
    this.characters = (data.characters || []).map(char =>
      char instanceof Character ? char : new Character(char)
    );
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      context: this.context,
      characters: this.characters.map(char => char.toJSON()),
      metadata: this.metadata
    };
  }
}

/**
 * Represents a complete simulation
 */
export class Simulation extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.type = data.type || SIMULATION_TYPES.DIALOG;
    this.title = data.title || '';
    this.description = data.description || '';
    this.scenario = data.scenario instanceof Scenario
      ? data.scenario
      : new Scenario(data.scenario || {});

    this.interactions = (data.interactions || []).map(interaction =>
      interaction instanceof Interaction ? interaction : new Interaction(interaction)
    );

    this.outcomes = (data.outcomes || []).map(outcome =>
      outcome instanceof Outcome ? outcome : new Outcome(outcome)
    );

    this.assets = (data.assets || []).map(asset =>
      asset instanceof Asset ? asset : new Asset(asset)
    );

    this.startInteractionId = data.startInteractionId ||
      (this.interactions.length > 0 ? this.interactions[0].id : null);

    this.metadata = data.metadata || {};
    this.minScore = data.minScore || 0;
    this.maxScore = data.maxScore || this.calculateMaxScore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      title: this.title,
      description: this.description,
      scenario: this.scenario.toJSON(),
      interactions: this.interactions.map(interaction => interaction.toJSON()),
      outcomes: this.outcomes.map(outcome => outcome.toJSON()),
      assets: this.assets.map(asset => asset.toJSON()),
      startInteractionId: this.startInteractionId,
      metadata: this.metadata,
      minScore: this.minScore,
      maxScore: this.maxScore
    };
  }

  /**
   * Calculate the maximum possible score for this simulation
   * @returns {number} - The maximum possible score
   */
  calculateMaxScore() {
    let maxScore = 0;

    // Add up points from all interactions
    this.interactions.forEach(interaction => {
      if (interaction.type === INTERACTION_TYPES.MULTIPLE_CHOICE) {
        // For multiple choice, find the highest-scoring option
        const maxPoints = Math.max(0, ...interaction.options.map(opt => opt.points));
        maxScore += maxPoints;
      } else {
        maxScore += interaction.points;
      }
    });

    return maxScore;
  }

  /**
   * Get an interaction by ID
   * @param {string} interactionId - The ID of the interaction to get
   * @returns {Interaction|null} - The interaction, or null if not found
   */
  getInteraction(interactionId) {
    return this.interactions.find(interaction => interaction.id === interactionId) || null;
  }

  /**
   * Get the first interaction in the simulation
   * @returns {Interaction|null} - The first interaction, or null if none
   */
  getStartInteraction() {
    if (this.startInteractionId) {
      return this.getInteraction(this.startInteractionId);
    }

    return this.interactions.length > 0 ? this.interactions[0] : null;
  }
}

export default {
  Character,
  InteractionOption,
  Interaction,
  Outcome,
  Asset,
  Scenario,
  Simulation
};