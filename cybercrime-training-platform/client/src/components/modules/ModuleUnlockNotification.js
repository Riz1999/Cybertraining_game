import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Module Unlock Notification component for displaying when a new module is unlocked
 * @param {Object} props - Component props
 * @param {Object} props.module - Unlocked module object
 * @param {Function} props.onClose - Function to call when closing the notification
 * @returns {React.ReactElement} Module Unlock Notification component
 */
const ModuleUnlockNotification = ({ module, onClose }) => {
  const [show, setShow] = useState(false);
  
  // Show notification with animation
  useEffect(() => {
    if (module) {
      setShow(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShow(false);
        
        // Call onClose after animation completes
        setTimeout(() => {
          onClose();
        }, 300);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [module, onClose]);
  
  // Handle close
  const handleClose = () => {
    setShow(false);
    
    // Call onClose after animation completes
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!module) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-all duration-300 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-police-blue text-white px-4 py-2 flex justify-between items-center">
          <div className="font-medium">New Module Unlocked!</div>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 bg-police-blue rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{module.description}</p>
              
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <span className="mr-3">{module.estimatedDuration} min</span>
                <span className="mr-3">{module.activities?.length || 0} activities</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {module.badgeReward?.name}
                </span>
              </div>
              
              <Link 
                to={`/modules/${module.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-police-blue hover:bg-police-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-police-blue"
                onClick={handleClose}
              >
                Start Module
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleUnlockNotification;