import React from 'react';
import { Card } from '../ui';

/**
 * Login Streak component for displaying user's login streak
 * @param {Object} props - Component props
 * @param {Object} props.streakData - User's streak data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Login Streak component
 */
const LoginStreak = ({ streakData, loading = false, className = '' }) => {
  if (!streakData && !loading) {
    return null;
  }

  // Generate array of days for streak display
  const generateDays = () => {
    const days = [];
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Get current day index (0-6, where 0 is Sunday)
    const today = new Date().getDay();
    
    // Generate past 7 days
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const isActive = streakData && i < streakData.currentStreak;
      
      days.push({
        label: daysOfWeek[dayIndex],
        isActive,
      });
    }
    
    return days;
  };

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Login Streak</h3>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-blue"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-500">Current Streak</div>
                <div className="text-2xl font-bold text-police-blue">{streakData.currentStreak} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Longest Streak</div>
                <div className="text-2xl font-bold text-police-blue">{streakData.longestStreak} days</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {generateDays().map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">{day.label}</div>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day.isActive 
                        ? 'bg-police-blue text-white' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day.isActive ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>·</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              {streakData.currentStreak > 0 ? (
                <>
                  <span className="font-medium">Great job!</span> Keep logging in daily to earn bonus XP.
                </>
              ) : (
                <>
                  Log in daily to build your streak and earn bonus XP.
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default LoginStreak;