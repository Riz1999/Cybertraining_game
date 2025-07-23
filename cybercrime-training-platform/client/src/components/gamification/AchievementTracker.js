import React from 'react';
import { Card, ProgressBar } from '../ui';

/**
 * Achievement Tracker component for displaying user achievements and progress
 * @param {Object} props - Component props
 * @param {Array} props.achievements - Array of achievement objects
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Achievement Tracker component
 */
const AchievementTracker = ({ achievements = [], className = '' }) => {
  // Calculate overall completion percentage
  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.length;
  const completionPercentage = totalAchievements > 0 
    ? Math.round((completedAchievements / totalAchievements) * 100) 
    : 0;

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
        <div className="mt-2 flex items-center">
          <ProgressBar 
            value={completionPercentage} 
            variant="police" 
            size="md" 
            className="flex-grow mr-3" 
          />
          <span className="text-sm font-medium text-gray-700">
            {completedAchievements}/{totalAchievements}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="p-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                achievement.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {achievement.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-grow">
                <h4 className="text-base font-medium text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                
                {achievement.progress !== undefined && !achievement.completed && (
                  <div className="mt-2">
                    <ProgressBar 
                      value={achievement.progress} 
                      variant="police" 
                      size="sm" 
                    />
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      {achievement.progressText || `${achievement.progress}%`}
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.xpReward && (
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {achievement.completed ? 'Earned' : 'Reward'}
                  </div>
                  <div className="text-sm text-blue-600">+{achievement.xpReward} XP</div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {achievements.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No achievements available
          </div>
        )}
      </div>
    </Card>
  );
};

export default AchievementTracker;