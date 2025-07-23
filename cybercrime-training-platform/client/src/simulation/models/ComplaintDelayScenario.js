/**
 * ComplaintDelayScenario.js
 * 
 * This file defines the data models and logic for the complaint delay scenario system
 * used in Module 4: Escalation to FIR and CCTNS.
 */
import { BaseModel, Scenario, Interaction, InteractionOption, Outcome } from './SimulationModels';
import { INTERACTION_TYPES } from './SimulationTypes';

/**
 * Represents a timeline event in a complaint delay scenario
 */
export class TimelineEvent extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.timestamp = data.timestamp || new Date();
    this.type = data.type || 'standard'; // standard, critical, decision
    this.icon = data.icon || 'clock';
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      timestamp: this.timestamp,
      type: this.type,
      icon: this.icon,
      metadata: this.metadata
    };
  }
}

/**
 * Represents a decision point in a complaint delay scenario
 */
export class DecisionPoint extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.options = (data.options || []).map(opt =>
      opt instanceof InteractionOption ? opt : new InteractionOption(opt)
    );
    this.timelineEventId = data.timelineEventId || null;
    this.contextInfo = data.contextInfo || '';
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      options: this.options.map(opt => opt.toJSON()),
      timelineEventId: this.timelineEventId,
      contextInfo: this.contextInfo,
      metadata: this.metadata
    };
  }
}

/**
 * Represents a complaint delay scenario
 */
export class ComplaintDelayScenario extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    this.scenario = data.scenario instanceof Scenario
      ? data.scenario
      : new Scenario(data.scenario || {});
    this.timelineEvents = (data.timelineEvents || []).map(event =>
      event instanceof TimelineEvent ? event : new TimelineEvent(event)
    );
    this.decisionPoints = (data.decisionPoints || []).map(point =>
      point instanceof DecisionPoint ? point : new DecisionPoint(point)
    );
    this.interactions = (data.interactions || []).map(interaction =>
      interaction instanceof Interaction ? interaction : new Interaction(interaction)
    );
    this.outcomes = (data.outcomes || []).map(outcome =>
      outcome instanceof Outcome ? outcome : new Outcome(outcome)
    );
    this.startTimelineEventId = data.startTimelineEventId ||
      (this.timelineEvents.length > 0 ? this.timelineEvents[0].id : null);
    this.metadata = data.metadata || {};
    this.minScore = data.minScore || 0;
    this.maxScore = data.maxScore || this.calculateMaxScore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      scenario: this.scenario.toJSON(),
      timelineEvents: this.timelineEvents.map(event => event.toJSON()),
      decisionPoints: this.decisionPoints.map(point => point.toJSON()),
      interactions: this.interactions.map(interaction => interaction.toJSON()),
      outcomes: this.outcomes.map(outcome => outcome.toJSON()),
      startTimelineEventId: this.startTimelineEventId,
      metadata: this.metadata,
      minScore: this.minScore,
      maxScore: this.maxScore
    };
  }

  /**
   * Calculate the maximum possible score for this scenario
   * @returns {number} - The maximum possible score
   */
  calculateMaxScore() {
    let maxScore = 0;

    // Add up points from all decision points
    this.decisionPoints.forEach(decisionPoint => {
      const maxPoints = Math.max(0, ...decisionPoint.options.map(opt => opt.points));
      maxScore += maxPoints;
    });

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
   * Get a timeline event by ID
   * @param {string} eventId - The ID of the timeline event to get
   * @returns {TimelineEvent|null} - The timeline event, or null if not found
   */
  getTimelineEvent(eventId) {
    return this.timelineEvents.find(event => event.id === eventId) || null;
  }

  /**
   * Get a decision point by ID
   * @param {string} decisionPointId - The ID of the decision point to get
   * @returns {DecisionPoint|null} - The decision point, or null if not found
   */
  getDecisionPoint(decisionPointId) {
    return this.decisionPoints.find(point => point.id === decisionPointId) || null;
  }

  /**
   * Get a decision point by timeline event ID
   * @param {string} timelineEventId - The ID of the timeline event
   * @returns {DecisionPoint|null} - The decision point, or null if not found
   */
  getDecisionPointByTimelineEvent(timelineEventId) {
    return this.decisionPoints.find(point => point.timelineEventId === timelineEventId) || null;
  }

  /**
   * Get the first timeline event in the scenario
   * @returns {TimelineEvent|null} - The first timeline event, or null if none
   */
  getStartTimelineEvent() {
    if (this.startTimelineEventId) {
      return this.getTimelineEvent(this.startTimelineEventId);
    }

    return this.timelineEvents.length > 0 ? this.timelineEvents[0] : null;
  }
}

export default {
  TimelineEvent,
  DecisionPoint,
  ComplaintDelayScenario
};