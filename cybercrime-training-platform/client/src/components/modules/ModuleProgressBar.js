import React from 'react';

/**
 * Module Progress Bar component for displaying progress within a module
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects
 * @param {string} props.currentActivityId - Current activity ID
 * @param {Object} props.progress - Module progress object
 * @param {Function} props.onActivityClick - Function to call when an activity is clicked
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Progress Bar component
 */
const ModuleProgressBar = ({ 
  activities = [], 
  currentActivityId, 
  progress, 
  onActivityClick,
  className = '' 
}) => {
  // Get activity status
  const getActivityStatus = (activityId) => {
    if (!progress || !progress.activitiesCompleted) {
      return 'not_started';
    }
    
    const activityProgress = progress.activitiesCompleted.find(a => a.activityId === activityId);
    
    if (!activityProgress) {
      return 'not_started';
    }
    
    return activityProgress.status;
  };
  
  // Check if activity is accessible
  const isActivityAccessible = (index) => {
    // First activity is always accessible
    if (index === 0) {
      return true;
    }
    
    // Check if previous activity is completed
    const prevActivityId = activities[index - 1]?.id;
    
    if (!prevActivityId) {
      return false;
    }
    
    const prevActivityStatus = getActivityStatus(prevActivityId);
    
    return prevActivityStatus === 'completed';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Module Progress</h3>
        <span className="text-xs text-gray-500">
          {progress?.activitiesCompleted?.filter(a => a.status === 'completed').length || 0}/{activities.length} activities
        </span>
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"></div>
        
        {/* Activity dots */}
        <div className="relative flex justify-between">
          {activities.map((activity, index) => {
            const status = getActivityStatus(activity.id);
            const isCurrent = activity.id === currentActivityId;
            const isAccessible = isActivityAccessible(index);
            
            // Determine dot color based on status
            let dotColor = 'bg-gray-300'; // not started and not accessible
            let textColor = 'text-gray-400';
            
            if (status === 'completed') {
              dotColor = 'bg-green-500';
              textColor = 'text-green-500';
            } else if (status === 'in_progress' || isCurrent) {
              dotColor = 'bg-police-blue';
              textColor = 'text-police-blue';
            } else if (isAccessible) {
              dotColor = 'bg-gray-400';
              textColor = 'text-gray-500';
            }
            
            return (
              <div key={activity.id} className="flex flex-col items-center">
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${dotColor} text-white relative z-10 ${
                    isAccessible ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
                  } ${isCurrent ? 'ring-2 ring-police-blue ring-offset-2' : ''}`}
                  onClick={() => isAccessible && onActivityClick(activity.id)}
                  disabled={!isAccessible}
                  title={activity.title}
                >
                  {status === 'completed' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>
                <span className={`text-xs mt-2 ${textColor} font-medium`}>
                  {activity.type === 'quiz' ? 'Quiz' : 
                   activity.type === 'simulation' ? 'Sim' :
                   activity.type === 'roleplay' ? 'Role' :
                   activity.type === 'dragdrop' ? 'Drag' : 'Task'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleProgressBar;