import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkLowBandwidth } from '../serviceWorkerRegistration';

// Create context
const NetworkStatusContext = createContext({
  isOnline: true,
  isLowBandwidth: false,
});

/**
 * NetworkStatusProvider component for tracking network status and bandwidth
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} NetworkStatusProvider component
 */
const NetworkStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  // Check network status on mount and when it changes
  useEffect(() => {
    // Function to update online status
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Check bandwidth on mount
    const checkBandwidth = async () => {
      const lowBandwidth = await checkLowBandwidth();
      setIsLowBandwidth(lowBandwidth);
    };
    
    checkBandwidth();

    // Set up periodic bandwidth checks (every 5 minutes)
    const bandwidthCheckInterval = setInterval(checkBandwidth, 5 * 60 * 1000);

    // Clean up event listeners and interval
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      clearInterval(bandwidthCheckInterval);
    };
  }, []);

  // Show offline notification when going offline
  useEffect(() => {
    if (!isOnline) {
      // Create and show a notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>You are currently offline. Some features may be limited.</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Remove the notification after 5 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }
  }, [isOnline]);

  // Show low bandwidth notification when detected
  useEffect(() => {
    if (isLowBandwidth && isOnline) {
      // Create and show a notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Low bandwidth detected. Switching to data-saving mode.</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Remove the notification after 5 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }
  }, [isLowBandwidth, isOnline]);

  return (
    <NetworkStatusContext.Provider value={{ isOnline, isLowBandwidth }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

// Custom hook to use the network status context
export const useNetworkStatus = () => useContext(NetworkStatusContext);

export default NetworkStatusProvider;