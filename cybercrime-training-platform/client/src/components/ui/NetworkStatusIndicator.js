import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';

/**
 * NetworkStatusIndicator component for displaying network status
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} NetworkStatusIndicator component
 */
const NetworkStatusIndicator = ({ className = '' }) => {
  const { isOnline, isLowBandwidth } = useNetworkStatus();
  const [showIndicator, setShowIndicator] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show indicator when offline or low bandwidth
  useEffect(() => {
    if (!isOnline || isLowBandwidth) {
      setShowIndicator(true);
    } else {
      // Hide indicator after 5 seconds when back online
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, isLowBandwidth]);

  // Don't render if no network issues
  if (!showIndicator) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="relative">
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
            !isOnline
              ? 'bg-red-500 text-white'
              : isLowBandwidth
              ? 'bg-yellow-500 text-white'
              : 'bg-green-500 text-white'
          }`}
          onClick={() => setShowTooltip(!showTooltip)}
          aria-label="Network status"
        >
          {!isOnline ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          ) : isLowBandwidth ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          )}
        </button>

        {showTooltip && (
          <div className="absolute bottom-12 right-0 w-64 bg-white rounded-lg shadow-lg p-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Network Status</h3>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {isOnline && (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isLowBandwidth ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="text-gray-700">
                    {isLowBandwidth ? 'Low Bandwidth Mode' : 'Normal Bandwidth'}
                  </span>
                </div>
              )}

              {isLowBandwidth && isOnline && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">
                    Low bandwidth mode reduces data usage by loading optimized content.
                  </p>
                  <button
                    className="text-xs text-police-blue hover:underline"
                    onClick={() => {
                      localStorage.setItem('preferReducedData', 'false');
                      window.location.reload();
                    }}
                  >
                    Disable Low Bandwidth Mode
                  </button>
                </div>
              )}

              {!isOnline && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    You are currently offline. Some features may be limited.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkStatusIndicator;