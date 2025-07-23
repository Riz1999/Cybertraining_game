/**
 * Simulation helper utilities
 */

/**
 * Generate a UUID - fallback for environments without crypto.randomUUID
 */
export const generateUUID = () => {
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
 * Format a date for display
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - The formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    includeTime: true,
    format: 'medium' // 'short', 'medium', 'long'
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Date formatting
    let dateFormat = {};
    switch (mergedOptions.format) {
      case 'short':
        dateFormat = { month: 'numeric', day: 'numeric', year: '2-digit' };
        break;
      case 'long':
        dateFormat = { month: 'long', day: 'numeric', year: 'numeric' };
        break;
      case 'medium':
      default:
        dateFormat = { month: 'short', day: 'numeric', year: 'numeric' };
    }
    
    // Add time if requested
    if (mergedOptions.includeTime) {
      dateFormat.hour = 'numeric';
      dateFormat.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-IN', dateFormat).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Calculate time difference between two dates
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {Object} - The time difference in various units
 */
export const getTimeDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffMs = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    milliseconds: diffMs,
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    totalHours: Math.floor(diffMs / (1000 * 60 * 60)),
    totalMinutes: Math.floor(diffMs / (1000 * 60))
  };
};

/**
 * Sort timeline events by date
 * @param {Array} events - The events to sort
 * @param {string} direction - The sort direction ('asc' or 'desc')
 * @returns {Array} - The sorted events
 */
export const sortTimelineEvents = (events, direction = 'asc') => {
  if (!Array.isArray(events)) return [];
  
  return [...events].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

export default {
  generateUUID,
  formatDate,
  getTimeDifference,
  sortTimelineEvents
};