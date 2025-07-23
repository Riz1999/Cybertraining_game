import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { NetworkStatusIndicator } from '../ui';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';

/**
 * Layout component that wraps all pages
 * Includes navigation and footer
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} - Layout component
 */
const Layout = ({ children }) => {
  const { isOnline, isLowBandwidth } = useNetworkStatus();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Show offline banner when user is offline */}
        {!isOnline && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  You are currently offline. Some features may be limited, but you can still access previously loaded content.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Show low bandwidth notice when in low bandwidth mode */}
        {isOnline && isLowBandwidth && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Low bandwidth mode is active. Content is being optimized to reduce data usage.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {children}
      </main>
      <Footer />
      <NetworkStatusIndicator />
    </div>
  );
};

export default Layout;