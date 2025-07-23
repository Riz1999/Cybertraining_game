/**
 * Dialog System Models
 * 
 * This file defines the data models used in the dialog system.
 */
import { MESSAGE_TYPES, PARTICIPANT_TYPES, EMOTIONAL_STATES, COMMUNICATION_METRICS } from './DialogTypes';
import { BaseModel } from '../../models/SimulationModels';

/**
 * Represents a dialog message in a conversation
 */
export class DialogMessage extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.type = data.type || MESSAGE_TYPES.TEXT;
    this.content = data.content || '';
    this.participantId = data.participantId || null;
    this.participantType = data.participantType || PARTICIPANT_TYPES.SYSTEM;
    this.timestamp = data.timestamp || new Date();
    this.metadata = data.metadata || {};
    
    // For audio messages
    this.audioUrl = data.audioUrl || null;
    this.audioDuration = data.audioDuration || null;
    
    // For option messages
    this.options = data.options || [];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      content: this.content,
      participantId: this.participantId,
      participantType: this.participantType,
      timestamp: this.timestamp,
      metadata: this.metadata,
      audioUrl: this.audioUrl,
      audioDuration: this.audioDuration,
      options: this.options
    };
  }
}

/**
 * Represents a dialog participant (character or user)
 */
export class DialogParticipant extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.type = data.type || PARTICIPANT_TYPES.CHARACTER;
    this.avatarUrl = data.avatarUrl || '';
    this.description = data.description || '';
    this.emotionalState = data.emotionalState || EMOTIONAL_STATES.NEUTRAL;
    this.traits = data.traits || [];
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      type: this.type,
      avatarUrl: this.avatarUrl,
      description: this.description,
      emotionalState: this.emotionalState,
      traits: this.traits,
      metadata: this.metadata
    };
  }

  /**
   * Update the emotional state of the participant
   * @param {string} newState - The new emotional state
   */
  updateEmotionalState(newState) {
    if (Object.values(EMOTIONAL_STATES).includes(newState)) {
      this.emotionalState = newState;
    } else {
      console.warn(`Invalid emotional state: ${newState}`);
    }
  }
}

/**
 * Represents a dialog option that the user can select
 */
export class DialogOption extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.text = data.text || '';
    this.nextNodeId = data.nextNodeId || null;
    this.metrics = data.metrics || {};
    this.feedback = data.feedback || '';
    this.isCorrect = data.isCorrect || false;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      nextNodeId: this.nextNodeId,
      metrics: this.metrics,
      feedback: this.feedback,
      isCorrect: this.isCorrect,
      metadata: this.metadata
    };
  }

  /**
   * Evaluate the communication quality of this option
   * @returns {Object} - The communication metrics for this option
   */
  evaluateCommunicationQuality() {
    return this.metrics;
  }
}

/**
 * Represents a node in a dialog tree
 */
export class DialogNode extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.message = data.message instanceof DialogMessage 
      ? data.message 
      : new DialogMessage(data.message || {});
    
    this.options = (data.options || []).map(opt => 
      opt instanceof DialogOption ? opt : new DialogOption(opt)
    );
    
    this.participantId = data.participantId || null;
    this.emotionalStateChange = data.emotionalStateChange || null;
    this.nextNodeId = data.nextNodeId || null;
    this.isEndNode = data.isEndNode || false;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      message: this.message.toJSON(),
      options: this.options.map(opt => opt.toJSON()),
      participantId: this.participantId,
      emotionalStateChange: this.emotionalStateChange,
      nextNodeId: this.nextNodeId,
      isEndNode: this.isEndNode,
      metadata: this.metadata
    };
  }

  /**
   * Get the next node ID based on the selected option
   * @param {string} optionId - The ID of the selected option
   * @returns {string|null} - The ID of the next node, or null if this is an end node
   */
  getNextNodeId(optionId) {
    if (this.isEndNode) {
      return null;
    }
    
    if (!optionId && this.nextNodeId) {
      return this.nextNodeId;
    }
    
    const option = this.options.find(opt => opt.id === optionId);
    return option ? option.nextNodeId : this.nextNodeId;
  }
}

/**
 * Represents a complete dialog tree
 */
export class DialogTree extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.description = data.description || '';
    
    this.nodes = {};
    if (data.nodes) {
      Object.entries(data.nodes).forEach(([nodeId, nodeData]) => {
        this.nodes[nodeId] = nodeData instanceof DialogNode 
          ? nodeData 
          : new DialogNode(nodeData);
      });
    }
    
    this.participants = {};
    if (data.participants) {
      Object.entries(data.participants).forEach(([participantId, participantData]) => {
        this.participants[participantId] = participantData instanceof DialogParticipant 
          ? participantData 
          : new DialogParticipant(participantData);
      });
    }
    
    this.rootNodeId = data.rootNodeId || null;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    const nodesJson = {};
    Object.entries(this.nodes).forEach(([nodeId, node]) => {
      nodesJson[nodeId] = node.toJSON();
    });
    
    const participantsJson = {};
    Object.entries(this.participants).forEach(([participantId, participant]) => {
      participantsJson[participantId] = participant.toJSON();
    });
    
    return {
      ...super.toJSON(),
      title: this.title,
      description: this.description,
      nodes: nodesJson,
      participants: participantsJson,
      rootNodeId: this.rootNodeId,
      metadata: this.metadata
    };
  }

  /**
   * Get a node by ID
   * @param {string} nodeId - The ID of the node to get
   * @returns {DialogNode|null} - The node, or null if not found
   */
  getNode(nodeId) {
    return this.nodes[nodeId] || null;
  }

  /**
   * Get a participant by ID
   * @param {string} participantId - The ID of the participant to get
   * @returns {DialogParticipant|null} - The participant, or null if not found
   */
  getParticipant(participantId) {
    return this.participants[participantId] || null;
  }

  /**
   * Get the root node of the dialog tree
   * @returns {DialogNode|null} - The root node, or null if not found
   */
  getRootNode() {
    return this.rootNodeId ? this.getNode(this.rootNodeId) : null;
  }

  /**
   * Add a node to the dialog tree
   * @param {DialogNode} node - The node to add
   */
  addNode(node) {
    this.nodes[node.id] = node;
  }

  /**
   * Add a participant to the dialog tree
   * @param {DialogParticipant} participant - The participant to add
   */
  addParticipant(participant) {
    this.participants[participant.id] = participant;
  }

  /**
   * Set the root node of the dialog tree
   * @param {string} nodeId - The ID of the node to set as root
   */
  setRootNode(nodeId) {
    if (this.nodes[nodeId]) {
      this.rootNodeId = nodeId;
    } else {
      console.warn(`Node with ID ${nodeId} not found`);
    }
  }
}

/**
 * Represents the state of a dialog
 */
export class DialogState extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.dialogTreeId = data.dialogTreeId || null;
    this.currentNodeId = data.currentNodeId || null;
    this.history = data.history || [];
    this.participantStates = data.participantStates || {};
    this.metrics = data.metrics || {
      [COMMUNICATION_METRICS.EMPATHY]: 0,
      [COMMUNICATION_METRICS.CLARITY]: 0,
      [COMMUNICATION_METRICS.PROFESSIONALISM]: 0,
      [COMMUNICATION_METRICS.ACCURACY]: 0,
      [COMMUNICATION_METRICS.PATIENCE]: 0
    };
    this.score = data.score || 0;
    this.isComplete = data.isComplete || false;
    this.metadata = data.metadata || {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      dialogTreeId: this.dialogTreeId,
      currentNodeId: this.currentNodeId,
      history: this.history,
      participantStates: this.participantStates,
      metrics: this.metrics,
      score: this.score,
      isComplete: this.isComplete,
      metadata: this.metadata
    };
  }

  /**
   * Update the dialog state with a new node and option selection
   * @param {string} nodeId - The ID of the new current node
   * @param {string} optionId - The ID of the selected option
   * @param {Object} metrics - The communication metrics for this selection
   */
  updateState(nodeId, optionId = null, metrics = {}) {
    // Add to history
    this.history.push({
      nodeId,
      optionId,
      timestamp: new Date()
    });
    
    // Update current node
    this.currentNodeId = nodeId;
    
    // Update metrics
    Object.entries(metrics).forEach(([metric, value]) => {
      if (this.metrics[metric] !== undefined) {
        this.metrics[metric] += value;
      }
    });
    
    // Update score based on metrics
    this.updateScore();
  }

  /**
   * Update the emotional state of a participant
   * @param {string} participantId - The ID of the participant
   * @param {string} emotionalState - The new emotional state
   */
  updateParticipantState(participantId, emotionalState) {
    this.participantStates[participantId] = {
      ...this.participantStates[participantId],
      emotionalState
    };
  }

  /**
   * Update the score based on the current metrics
   */
  updateScore() {
    // Simple scoring algorithm: average of all metrics
    const metricValues = Object.values(this.metrics);
    this.score = metricValues.reduce((sum, value) => sum + value, 0) / metricValues.length;
  }

  /**
   * Mark the dialog as complete
   */
  complete() {
    this.isComplete = true;
  }
}

export default {
  DialogMessage,
  DialogParticipant,
  DialogOption,
  DialogNode,
  DialogTree,
  DialogState
};