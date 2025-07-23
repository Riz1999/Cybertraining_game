import React from 'react';
import { Button } from '../ui';

/**
 * Module Activity Navigation component for navigating between activities
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects
 * @param {string} props.currentActivityId - Current activity ID
 * @param {Object} props.progress - Module progress object
 * @param {Function} props.onPrevious - Function to call when navigating to previous activity
 * @param {Function} props.onNext - Function to call when navigating to next activity
 * @param {Function} props.onComplete - Function to call when completing the module
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Activity Navigation component
 */
const ModuleActivityNavigation = ({ 
  activities = [], 
  currentActivityId, 
  progress,
  onPrevious,
  onNext,
  onComplete,
  className = '' 
}) => {
  // Find current activity index
  const currentIndex = activities.findIndex(activity => activity.id === currentActivityId);
  
  // Determine if there's a previous activity
  const hasPrevious = currentIndex > 0;
  
  // Determine if there's a next activity
  const hasNext = currentIndex < activities.length - 1;
  
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
  
  // Check if current activity is completed
  const isCurrentActivityCompleted = getActivityStatus(currentActivityId) === 'completed';
  
  // Check if all activities are completed
  const areAllActivitiesCompleted = activities.every(activity => 
    getActivityStatus(activity.id) === 'completed'
  );
  
  // Get previous and next activity
  const previousActivity = hasPrevious ? activities[currentIndex - 1] : null;
  const nextActivity = hasNext ? activities[currentIndex + 1] : null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Previous button */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={!hasPrevious ? 'invisible' : ''}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </div>
      </Button>
      
      {/* Next/Complete button */}
      {hasNext ? (
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!isCurrentActivityCompleted}
        >
          <div className="flex items-center">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Button>
      ) : (
        <Button
          variant="success"
          onClick={onComplete}
          disabled={!areAllActivitiesCompleted}
        >
          <div className="flex items-center">
            Complete Module
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ModuleActivityNavigation;