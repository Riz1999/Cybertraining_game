import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from '../ui';
import { 
  clearXPNotification, 
  clearBadgeNotification, 
  clearLevelUpNotification 
} from '../../store/actions/progressActions';

/**
 * Gamification Notification component for displaying XP, badge, and level up notifications
 * @returns {React.ReactElement} Gamification Notification component
 */
const GamificationNotification = () => {
  const dispatch = useDispatch();
  const { xpNotification, badgeNotification, levelUpNotification } = useSelector(state => state.progress);
  
  const [showXP, setShowXP] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Handle XP notification
  useEffect(() => {
    if (xpNotification) {
      setShowXP(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowXP(false);
        // Clear notification from Redux after animation completes
        setTimeout(() => {
          dispatch(clearXPNotification());
        }, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [xpNotification, dispatch]);
  
  // Handle badge notification
  useEffect(() => {
    if (badgeNotification) {
      setShowBadge(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowBadge(false);
        // Clear notification from Redux after animation completes
        setTimeout(() => {
          dispatch(clearBadgeNotification());
        }, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [badgeNotification, dispatch]);
  
  // Handle level up notification
  useEffect(() => {
    if (levelUpNotification) {
      setShowLevelUp(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowLevelUp(false);
        // Clear notification from Redux after animation completes
        setTimeout(() => {
          dispatch(clearLevelUpNotification());
        }, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [levelUpNotification, dispatch]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-4">
      {/* XP Notification */}
      {showXP && (
        <div className={`bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ${showXP ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center">
            <div className="bg-police-blue text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">XP Earned!</div>
              <div className="text-sm text-gray-600">+{xpNotification?.earned} XP</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Badge Notification */}
      {showBadge && (
        <div className={`bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ${showBadge ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center">
            <Badge
              imageUrl={badgeNotification?.imageUrl}
              size="md"
              className="mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Badge Earned!</div>
              <div className="text-sm text-gray-600">{badgeNotification?.name}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Level Up Notification */}
      {showLevelUp && (
        <div className={`bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ${showLevelUp ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center">
            <div className="bg-police-gold text-police-blue rounded-full w-10 h-10 flex items-center justify-center mr-3 font-bold">
              {levelUpNotification}
            </div>
            <div>
              <div className="font-medium text-gray-900">Level Up!</div>
              <div className="text-sm text-gray-600">You reached level {levelUpNotification}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationNotification;