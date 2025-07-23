/**
 * OfficerAvatar Component
 * 
 * This component renders an interactive digital senior officer avatar
 * that guides users through the onboarding experience.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const OfficerAvatar = ({
  message,
  emotion = 'neutral',
  isTyping = false,
  onMessageComplete,
  showContinueButton = true,
  className = ''
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (!message || isComplete) return;

    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Typing speed

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onMessageComplete?.();
    }
  }, [message, currentIndex, isComplete, onMessageComplete]);

  // Reset when message changes
  useEffect(() => {
    setDisplayedMessage('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [message]);

  const getAvatarExpression = () => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'serious':
        return '🧐';
      case 'concerned':
        return '😟';
      case 'proud':
        return '😌';
      case 'encouraging':
        return '👍';
      default:
        return '🙂';
    }
  };

  const getAvatarStyle = () => {
    const baseStyle = 'w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300';
    
    switch (emotion) {
      case 'happy':
        return `${baseStyle} bg-green-100 border-4 border-green-300`;
      case 'serious':
        return `${baseStyle} bg-blue-100 border-4 border-blue-300`;
      case 'concerned':
        return `${baseStyle} bg-yellow-100 border-4 border-yellow-300`;
      case 'proud':
        return `${baseStyle} bg-purple-100 border-4 border-purple-300`;
      case 'encouraging':
        return `${baseStyle} bg-green-100 border-4 border-green-300`;
      default:
        return `${baseStyle} bg-gray-100 border-4 border-gray-300`;
    }
  };

  return (
    <div className={`officer-avatar flex items-start space-x-4 ${className}`}>
      {/* Avatar Image */}
      <div className="flex-shrink-0">
        <div className={getAvatarStyle()}>
          {getAvatarExpression()}
        </div>
        <div className="text-center mt-2">
          <div className="text-sm font-semibold text-gray-700">Senior Officer</div>
          <div className="text-xs text-gray-500">Cybercrime Division</div>
        </div>
      </div>

      {/* Message Bubble */}
      <div className="flex-1 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-4 relative">
          {/* Speech bubble arrow */}
          <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white transform -translate-x-2"></div>
          
          {/* Message content */}
          <div className="message-content">
            <p className="text-gray-800 leading-relaxed">
              {displayedMessage}
              {isTyping && !isComplete && (
                <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
              )}
            </p>
            
            {/* Continue button */}
            {isComplete && showContinueButton && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onMessageComplete?.()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

OfficerAvatar.propTypes = {
  message: PropTypes.string.isRequired,
  emotion: PropTypes.oneOf(['neutral', 'happy', 'serious', 'concerned', 'proud', 'encouraging']),
  isTyping: PropTypes.bool,
  onMessageComplete: PropTypes.func,
  showContinueButton: PropTypes.bool,
  className: PropTypes.string
};

export default OfficerAvatar;