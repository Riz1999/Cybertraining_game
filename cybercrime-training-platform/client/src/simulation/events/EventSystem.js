/**
 * Simulation Event System
 * 
 * This module provides an event handling system for simulations,
 * allowing components to subscribe to and emit events.
 */

class EventSystem {
  constructor() {
    this.events = {};
    this.onceEvents = {};
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - The name of the event to subscribe to
   * @param {Function} callback - The callback function to execute when the event is emitted
   * @returns {Function} - A function to unsubscribe from the event
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} eventName - The name of the event to subscribe to
   * @param {Function} callback - The callback function to execute when the event is emitted
   * @returns {Function} - A function to unsubscribe from the event
   */
  once(eventName, callback) {
    if (!this.onceEvents[eventName]) {
      this.onceEvents[eventName] = [];
    }
    
    this.onceEvents[eventName].push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.offOnce(eventName, callback);
    };
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - The name of the event to unsubscribe from
   * @param {Function} callback - The callback function to unsubscribe
   */
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return;
    }
    
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    
    if (this.events[eventName].length === 0) {
      delete this.events[eventName];
    }
  }

  /**
   * Unsubscribe from a once event
   * @param {string} eventName - The name of the event to unsubscribe from
   * @param {Function} callback - The callback function to unsubscribe
   */
  offOnce(eventName, callback) {
    if (!this.onceEvents[eventName]) {
      return;
    }
    
    this.onceEvents[eventName] = this.onceEvents[eventName].filter(cb => cb !== callback);
    
    if (this.onceEvents[eventName].length === 0) {
      delete this.onceEvents[eventName];
    }
  }

  /**
   * Emit an event
   * @param {string} eventName - The name of the event to emit
   * @param {...any} args - The arguments to pass to the event callbacks
   */
  emit(eventName, ...args) {
    // Regular event subscribers
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
    
    // Once event subscribers
    if (this.onceEvents[eventName]) {
      const callbacks = [...this.onceEvents[eventName]];
      delete this.onceEvents[eventName];
      
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in once event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Clear all event subscriptions
   */
  clear() {
    this.events = {};
    this.onceEvents = {};
  }
}

// Create a singleton instance for global events
export const globalEventSystem = new EventSystem();

// Export the class for creating scoped event systems
export default EventSystem;