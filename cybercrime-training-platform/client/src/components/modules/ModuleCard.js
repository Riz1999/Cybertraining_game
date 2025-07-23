import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, ProgressBar } from '../ui';

/**
 * Module Card component for displaying a module card
 * @param {Object} props - Component props
 * @param {Object} props.module - Module object
 * @param {Object} props.progress - Module progress object
 * @param {boolean} props.isLocked - Whether the module is locked
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Card component
 */
const ModuleCard = ({ module, progress = {}, isLocked = false, className = '' }) => {
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!progress.activitiesCompleted || !module.activities) {
      return 0;
    }
    
    const completedActivities = progress.activitiesCompleted.filter(a => a.status === 'completed').length;
    const totalActivities = module.activities.length;
    
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  };
  
  // Get module status
  const getModuleStatus = () => {
    if (isLocked) {
      return 'locked';
    }
    
    return progress.status || 'not_started';
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
      default:
        return <Badge variant="primary">Not Started</Badge>;
    }
  };
  
  const status = getModuleStatus();
  const completionPercentage = getCompletionPercentage();

  return (
    <Card className={`h-full flex flex-col ${className} ${isLocked ? 'opacity-75' : ''}`}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
          {getStatusBadge(status)}
        </div>
        
        <p className="text-gray-600 mb-4 flex-1">{module.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {module.estimatedDuration} min
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {module.activities ? module.activities.length : 0} activities
            </div>
          </div>
          
          {status !== 'not_started' && status !== 'locked' && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              <ProgressBar 
                value={completionPercentage} 
                variant={status === 'completed' ? 'success' : 'police'} 
                size="sm" 
              />
            </div>
          )}
          
          {isLocked ? (
            <button 
              className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed flex items-center justify-center"
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </button>
          ) : (
            <Link 
              to={`/modules/${module.id}`}
              className={`w-full px-4 py-2 rounded-md flex items-center justify-center ${
                status === 'completed' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-police-blue text-white hover:bg-police-blue-dark'
              }`}
            >
              {status === 'completed' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Review
                </>
              ) : status === 'in_progress' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Continue
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start
                </>
              )}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;