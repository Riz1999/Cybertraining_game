/**
 * Dialog Engine
 * 
 * This module provides the core functionality for the dialog system.
 */
import { DialogTree, DialogState, DialogNode, DialogOption } from './DialogModels';
import { COMMUNICATION_METRICS } from './DialogTypes';
import EventSystem from '../../events/EventSystem';

class DialogEngine {
  /**
   * Create a new dialog engine
   * @param {Object|DialogTree} dialogTreeData - The dialog tree data or instance
   * @param {Object} options - Configuration options
   */
  constructor(dialogTreeData, options = {}) {
    // Create the dialog tree
    this.dialogTree = dialogTreeData instanceof DialogTree 
      ? dialogTreeData 
      : new DialogTree(dialogTreeData);
    
    // Create the dialog state
    this.state = new DialogState({
      dialogTreeId: this.dialogTree.id,
      currentNodeId: this.dialogTree.rootNodeId
    });
    
    // Create an event system
    this.events = new EventSystem();
    
    // Configuration options
    this.options = {
      autoStart: false,
      trackMetrics: true,
      audioEnabled: true,
      ...options
    };
    
    // Track if the dialog is initialized
    this.initialized = false;
  }

  /**
   * Initialize the dialog engine
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
    this.events.emit('dialog:initialized', this);
    
    // Auto-start if configured
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * Set up event listeners for the dialog engine
   */
  setupEventListeners() {
    // Example event listeners
    this.events.on('dialog:option:selected', this.handleOptionSelected.bind(this));
    this.events.on('dialog:node:complete', this.handleNodeComplete.bind(this));
    this.events.on('dialog:complete', this.handleDialogComplete.bind(this));
  }

  /**
   * Start the dialog
   */
  start() {
    if (!this.initialized) {
      this.initialize();
    }
    
    const rootNode = this.dialogTree.getRootNode();
    
    if (!rootNode) {
      console.error('No root node found in dialog tree');
      return;
    }
    
    // Set the current node to the root node
    this.state.currentNodeId = rootNode.id;
    
    // Emit start event
    this.events.emit('dialog:start', {
      dialogTreeId: this.dialogTree.id,
      rootNodeId: rootNode.id
    });
    
    // Process the root node
    this.processNode(rootNode);
  }

  /**
   * Process a dialog node
   * @param {DialogNode} node - The node to process
   */
  processNode(node) {
    if (!node) {
      console.error('Invalid node provided to processNode');
      return;
    }
    
    // Emit node event
    this.events.emit('dialog:node', {
      node,
      state: this.state
    });
    
    // Check if this is an end node
    if (node.isEndNode) {
      this.complete();
      return;
    }
    
    // Apply emotional state changes if any
    if (node.emotionalStateChange && node.participantId) {
      const participant = this.dialogTree.getParticipant(node.participantId);
      if (participant) {
        participant.updateEmotionalState(node.emotionalStateChange);
        this.state.updateParticipantState(node.participantId, node.emotionalStateChange);
      }
    }
    
    // If the node has no options, automatically proceed to the next node
    if (node.options.length === 0 && node.nextNodeId) {
      this.events.emit('dialog:node:auto', {
        currentNodeId: node.id,
        nextNodeId: node.nextNodeId
      });
      
      setTimeout(() => {
        this.proceedToNextNode(node.nextNodeId);
      }, this.options.autoNodeDelay || 2000);
    }
  }

  /**
   * Handle a selected option
   * @param {Object} data - The option selection data
   */
  handleOptionSelected(data) {
    const { nodeId, optionId } = data;
    
    const node = this.dialogTree.getNode(nodeId);
    if (!node) {
      console.error(`Node with ID ${nodeId} not found`);
      return;
    }
    
    const option = node.options.find(opt => opt.id === optionId);
    if (!option) {
      console.error(`Option with ID ${optionId} not found in node ${nodeId}`);
      return;
    }
    
    // Update metrics based on the selected option
    if (this.options.trackMetrics) {
      const metrics = option.evaluateCommunicationQuality();
      this.state.updateState(nodeId, optionId, metrics);
    } else {
      this.state.updateState(nodeId, optionId);
    }
    
    // Emit option selected event
    this.events.emit('dialog:option:selected:complete', {
      nodeId,
      optionId,
      option,
      nextNodeId: option.nextNodeId || node.nextNodeId,
      feedback: option.feedback
    });
    
    // Proceed to the next node
    const nextNodeId = option.nextNodeId || node.nextNodeId;
    if (nextNodeId) {
      this.proceedToNextNode(nextNodeId);
    } else if (node.isEndNode) {
      this.complete();
    }
  }

  /**
   * Handle node completion
   * @param {Object} data - The node completion data
   */
  handleNodeComplete(data) {
    console.log('Node completed:', data);
    // Additional handling can be added here
  }

  /**
   * Handle dialog completion
   * @param {Object} data - The dialog completion data
   */
  handleDialogComplete(data) {
    console.log('Dialog completed:', data);
    // Additional handling can be added here
  }

  /**
   * Proceed to the next node
   * @param {string} nextNodeId - The ID of the next node
   */
  proceedToNextNode(nextNodeId) {
    const nextNode = this.dialogTree.getNode(nextNodeId);
    
    if (!nextNode) {
      console.error(`Next node with ID ${nextNodeId} not found`);
      return;
    }
    
    // Update the current node
    this.state.currentNodeId = nextNodeId;
    
    // Process the next node
    this.processNode(nextNode);
  }

  /**
   * Select an option in the current node
   * @param {string} optionId - The ID of the option to select
   */
  selectOption(optionId) {
    const currentNodeId = this.state.currentNodeId;
    const currentNode = this.dialogTree.getNode(currentNodeId);
    
    if (!currentNode) {
      console.error(`Current node with ID ${currentNodeId} not found`);
      return;
    }
    
    // Emit option selected event
    this.events.emit('dialog:option:selected', {
      nodeId: currentNodeId,
      optionId
    });
  }

  /**
   * Complete the dialog
   */
  complete() {
    // Mark the dialog as complete
    this.state.complete();
    
    // Emit complete event
    this.events.emit('dialog:complete', {
      dialogTreeId: this.dialogTree.id,
      state: this.state
    });
  }

  /**
   * Get the current dialog state
   * @returns {DialogState} - The current dialog state
   */
  getState() {
    return this.state;
  }

  /**
   * Get the current node
   * @returns {DialogNode|null} - The current node, or null if not found
   */
  getCurrentNode() {
    return this.dialogTree.getNode(this.state.currentNodeId);
  }

  /**
   * Get the dialog tree
   * @returns {DialogTree} - The dialog tree
   */
  getDialogTree() {
    return this.dialogTree;
  }

  /**
   * Check if the dialog is complete
   * @returns {boolean} - Whether the dialog is complete
   */
  isComplete() {
    return this.state.isComplete;
  }

  /**
   * Get the communication metrics
   * @returns {Object} - The communication metrics
   */
  getMetrics() {
    return { ...this.state.metrics };
  }

  /**
   * Get the dialog score
   * @returns {number} - The dialog score
   */
  getScore() {
    return this.state.score;
  }

  /**
   * Clean up the dialog engine
   */
  destroy() {
    // Clear event listeners
    this.events.clear();
  }
}

export default DialogEngine;