/**
 * Network utility functions for detecting network conditions and optimizing content delivery
 */

/**
 * Check if the user is on a low-bandwidth connection
 * @returns {boolean} Whether the user is on a low-bandwidth connection
 */
export const isLowBandwidth = () => {
  // Use the Network Information API if available
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // Check if the connection is slow
    if (connection.downlink < 1 || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true;
    }
    
    // Check if the user has enabled data saver
    if (connection.saveData) {
      return true;
    }
  }
  
  // Check if the user has enabled data saver in the browser
  if ('saveData' in navigator && navigator.saveData) {
    return true;
  }
  
  // Check if the user has set a preference for reduced data usage
  if (localStorage.getItem('preferReducedData') === 'true') {
    return true;
  }
  
  return false;
};

/**
 * Set user preference for reduced data usage
 * @param {boolean} value - Whether to prefer reduced data usage
 */
export const setPreferReducedData = (value) => {
  localStorage.setItem('preferReducedData', value ? 'true' : 'false');
};

/**
 * Get user preference for reduced data usage
 * @returns {boolean} Whether the user prefers reduced data usage
 */
export const getPreferReducedData = () => {
  return localStorage.getItem('preferReducedData') === 'true';
};

/**
 * Check if the user is online
 * @returns {boolean} Whether the user is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Add event listener for online/offline events
 * @param {Function} callback - Callback function to call when online status changes
 * @returns {Function} Function to remove the event listeners
 */
export const addOnlineStatusListener = (callback) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Add event listener for connection change events
 * @param {Function} callback - Callback function to call when connection changes
 * @returns {Function} Function to remove the event listeners
 */
export const addConnectionChangeListener = (callback) => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    const handleConnectionChange = () => {
      callback({
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    };
    
    connection.addEventListener('change', handleConnectionChange);
    
    return () => {
      connection.removeEventListener('change', handleConnectionChange);
    };
  }
  
  return () => {};
};