import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';

/**
 * TimerResultAnimation component
 * 
 * Animated overlay for displaying challenge results with different
 * animations based on success, failure, or timeout.
 * 
 * @param {Object} props - Component props
 * @param {string} props.result - Result type: 'success', 'failure', 'timeout', 'excellent'
 * @param {Object} props.scoreData - Score data object
 * @param {Function} props.onAnimationComplete - Callback when animation completes
 * @param {boolean} props.showConfetti - Whether to show confetti animation
 */
const TimerResultAnimation = ({
  result = 'success',
  scoreData = {},
  onAnimationComplete,
  showConfetti = false
}) => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Show animation with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show details after animation
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowDetails(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  // Handle continue button click
  const handleContinue = () => {
    setVisible(false);
    
    // Call onAnimationComplete after exit animation
    setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 500);
  };
  
  // Get result-specific content
  const getResultContent = () => {
    switch (result) {
      case 'excellent':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          ),
          title: 'Excellent!',
          message: 'Outstanding performance! You completed the challenge with exceptional speed and accuracy.',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'success':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Success!',
          message: 'You successfully completed the challenge within the time limit.',
          color: 'bg-green-500',
          textColor: 'text-green-800',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'failure':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Not Quite Right',
          message: 'You completed the challenge, but there were some errors in your approach.',
          color: 'bg-red-500',
          textColor: 'text-red-800',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'timeout':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Time&apos;s Up!',
          message: 'You ran out of time before completing the challenge.',
          color: 'bg-orange-500',
          textColor: 'text-orange-800',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Challenge Complete',
          message: 'You have completed the challenge.',
          color: 'bg-blue-500',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };
  
  const resultContent = getResultContent();
  
  return (
    <div className={`
      fixed inset-0 flex items-center justify-center z-50
      bg-black bg-opacity-50 backdrop-blur-sm
      transition-opacity duration-500
      ${visible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        transform transition-all duration-500 ease-out
        ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}
        max-w-lg w-full mx-4 rounded-lg shadow-xl overflow-hidden
        ${resultContent.bgColor} border ${resultContent.borderColor}
      `}>
        {/* Result header */}
        <div className={`${resultContent.color} p-6 flex flex-col items-center`}>
          <div className={`
            rounded-full bg-white p-4 mb-4
            transform transition-transform duration-1000 ease-out
            ${visible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
          `}>
            {resultContent.icon}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{resultContent.title}</h2>
        </div>
        
        {/* Result content */}
        <div className="p-6">
          <p className={`text-center ${resultContent.textColor} mb-6`}>
            {resultContent.message}
          </p>
          
          {/* Score details */}
          {showDetails && scoreData && (
            <div className={`
              transition-all duration-500 ease-out
              ${showDetails ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
            `}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Total Score</div>
                  <div className="text-2xl font-bold">{scoreData.totalScore || 0}%</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Time Used</div>
                  <div className="text-2xl font-bold">
                    {scoreData.timeUsed ? Math.round(scoreData.timeUsed) : 0}s
                  </div>
                </div>
              </div>
              
              {/* Score breakdown */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{scoreData.completionScore || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${scoreData.completionScore || 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Speed</span>
                    <span className="font-medium">{scoreData.speedScore || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${scoreData.speedScore || 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-medium">{scoreData.accuracyScore || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${scoreData.accuracyScore || 0}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Time bonus */}
              {scoreData.bonus && scoreData.bonus.hadBonus && (
                <div className="bg-yellow-100 border border-yellow-200 rounded-md p-3 mb-6 text-center">
                  <div className="text-yellow-800 font-medium">Time Bonus: +{scoreData.bonus.bonusPercentage}%</div>
                  <div className="text-sm text-yellow-700">
                    You earned {scoreData.bonus.bonusPoints} bonus points for fast completion!
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Continue button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              variant={result === 'excellent' ? 'warning' : result === 'success' ? 'success' : 'primary'}
              size="lg"
              className={`
                transition-all duration-500 ease-out
                ${showDetails ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
              `}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
      
      {/* Confetti effect */}
      {showConfetti && visible && (
        <div className="confetti-container">
          {/* This would be implemented with a confetti library in a real application */}
          {/* For now, we'll just show some colored dots */}
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const color = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][
              Math.floor(Math.random() * 5)
            ];
            
            return (
              <div
                key={i}
                className={`absolute rounded-full ${color}`}
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: '-20px',
                  animation: `fall ${animationDuration}s ease-in ${delay}s forwards`
                }}
              />
            );
          })}
        </div>
      )}
      
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

TimerResultAnimation.propTypes = {
  result: PropTypes.oneOf(['success', 'failure', 'timeout', 'excellent']),
  scoreData: PropTypes.object,
  onAnimationComplete: PropTypes.func,
  showConfetti: PropTypes.bool
};

export default TimerResultAnimation;