import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { calculateUrgencyLevel } from './TimerScoring';

/**
 * TimePressureIndicator component
 * 
 * Visual indicator for time pressure in timed challenges.
 * Shows different states based on remaining time percentage.
 * 
 * @param {Object} props - Component props
 * @param {number} props.timeLeft - Time left in seconds
 * @param {number} props.totalTime - Total time in seconds
 * @param {string} props.position - Position of the indicator: 'top', 'bottom', 'left', 'right'
 * @param {boolean} props.showAlerts - Whether to show alert messages
 * @param {boolean} props.enableSound - Whether to enable sound effects
 * @param {Function} props.onUrgencyChange - Callback when urgency level changes
 */
const TimePressureIndicator = ({
  timeLeft,
  totalTime,
  position = 'top',
  showAlerts = true,
  enableSound = false,
  onUrgencyChange
}) => {
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Calculate percentage and urgency level
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  
  // Update urgency level based on time left
  useEffect(() => {
    const newUrgencyLevel = calculateUrgencyLevel(timeLeft, totalTime);
    
    if (newUrgencyLevel !== urgencyLevel) {
      setUrgencyLevel(newUrgencyLevel);
      
      // Show alert when urgency level changes
      if (showAlerts) {
        let message = '';
        
        switch (newUrgencyLevel) {
          case 'warning':
            message = 'Time is running low! Speed up your actions.';
            break;
          case 'critical':
            message = 'CRITICAL: Only seconds remaining!';
            break;
          default:
            message = '';
        }
        
        if (message) {
          setAlertMessage(message);
          setShowAlert(true);
          
          // Hide alert after 3 seconds
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      }
      
      // Play sound if enabled
      if (enableSound && newUrgencyLevel !== 'normal') {
        // Sound effect would be played here
        // This is just a placeholder for actual sound implementation
        console.log(`Playing ${newUrgencyLevel} sound effect`);
      }
      
      // Call onUrgencyChange callback
      if (onUrgencyChange) {
        onUrgencyChange(newUrgencyLevel, {
          timeLeft,
          totalTime,
          percentage
        });
      }
    }
  }, [timeLeft, totalTime, urgencyLevel, showAlerts, enableSound, onUrgencyChange]);
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-0 left-0 right-0';
      case 'left':
        return 'left-0 top-0 bottom-0 w-2';
      case 'right':
        return 'right-0 top-0 bottom-0 w-2';
      case 'top':
      default:
        return 'top-0 left-0 right-0';
    }
  };
  
  // Get color classes based on urgency level
  const getColorClasses = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'normal':
      default:
        return 'bg-blue-500';
    }
  };
  
  // Get animation classes based on urgency level
  const getAnimationClasses = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'animate-pulse';
      default:
        return '';
    }
  };
  
  // Determine if indicator is horizontal or vertical
  const isHorizontal = position === 'top' || position === 'bottom';
  
  return (
    <>
      {/* Time pressure indicator bar */}
      <div className={`time-pressure-indicator fixed ${getPositionClasses()} h-2 z-50`}>
        <div
          className={`h-full ${getColorClasses()} ${getAnimationClasses()} transition-all duration-300 ease-out`}
          style={{
            width: isHorizontal ? `${percentage}%` : '100%',
            height: !isHorizontal ? `${percentage}%` : '100%'
          }}
        />
      </div>
      
      {/* Alert message */}
      {showAlert && alertMessage && (
        <div className={`
          fixed z-50 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md
          ${urgencyLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}
          ${position === 'top' ? 'top-4' : 'bottom-4'}
          transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center">
            {urgencyLevel === 'critical' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {urgencyLevel === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            )}
            {alertMessage}
          </div>
        </div>
      )}
    </>
  );
};

TimePressureIndicator.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  totalTime: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showAlerts: PropTypes.bool,
  enableSound: PropTypes.bool,
  onUrgencyChange: PropTypes.func
};

export default TimePressureIndicator;