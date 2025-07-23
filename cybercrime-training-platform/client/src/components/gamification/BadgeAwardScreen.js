import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from '../ui';
import { clearBadgeNotification } from '../../store/actions/progressActions';
import confetti from 'canvas-confetti';

/**
 * Badge Award Screen component for displaying badge earning celebration
 * @param {Object} props - Component props
 * @param {Object} props.badge - Badge object that was earned
 * @param {Function} props.onContinue - Function to call when continuing
 * @param {Function} props.onClose - Function to call when closing
 * @param {boolean} props.showNextModule - Whether to show next module info
 * @param {Object} props.nextModule - Next module object
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Badge Award Screen component
 */
const BadgeAwardScreen = ({ 
  badge, 
  onContinue, 
  onClose, 
  showNextModule = true,
  nextModule,
  className = '' 
}) => {
  const dispatch = useDispatch();
  const [animateIn, setAnimateIn] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger animations and confetti on mount
  useEffect(() => {
    // Animate in after a short delay
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    // Show badge with delay for animation effect
    setTimeout(() => {
      setShowBadge(true);
    }, 800);

    // Trigger confetti
    setTimeout(() => {
      setShowConfetti(true);
      triggerConfetti();
    }, 1200);

    // Clear badge notification after component mounts
    return () => {
      dispatch(clearBadgeNotification());
    };
  }, [dispatch]);

  // Confetti animation
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };

  if (!badge) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className={`transition-all duration-1000 ease-out transform ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <Card className="max-w-md w-full shadow-2xl">
          {/* Header with celebration */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-t-lg text-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-4 w-4 h-4 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-6 w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-8 w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="absolute bottom-2 right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-yellow-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-yellow-100">You&apos;ve earned a new badge!</p>
            </div>
          </div>
          
          <div className="p-6">
            {/* Badge display with animation */}
            <div className={`transition-all duration-1000 ease-out transform ${showBadge ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-180'}`}>
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  {/* Badge image */}
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <img 
                      src={badge.imageUrl || '/assets/badges/cyber-awareness-starter.svg'} 
                      alt={badge.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                  </div>
                  
                  {/* Badge info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{badge.description}</p>
                </div>
              </div>
            </div>
            
            {/* Achievement stats */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-police-blue">+100</div>
                  <div className="text-sm text-gray-600">XP Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-gray-600">Module Complete</div>
                </div>
              </div>
            </div>
            
            {/* Next module preview */}
            {showNextModule && nextModule && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-police-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Next Module Unlocked
                </h4>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-police-blue rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-medium">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{nextModule.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{nextModule.description}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                View Dashboard
              </Button>
              
              {showNextModule && nextModule && (
                <Button 
                  variant="primary"
                  onClick={onContinue}
                  className="flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Continue to Next Module
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BadgeAwardScreen;