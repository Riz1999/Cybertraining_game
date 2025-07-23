import React from 'react';
import { Link } from 'react-router-dom';
import { Card, ProgressBar, Button } from '../ui';

/**
 * Module Progress component for displaying module completion status
 * @param {Object} props - Component props
 * @param {Array} props.modules - Array of module objects
 * @param {Object} props.progress - User progress object
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Progress component
 */
const ModuleProgress = ({ modules = [], progress = {}, className = '' }) => {
  // Get module progress
  const getModuleProgress = (moduleId) => {
    if (!progress.modules) return null;
    return progress.modules.find(m => m.moduleId === moduleId);
  };
  
  // Calculate module completion percentage
  const getCompletionPercentage = (moduleProgress, module) => {
    if (!moduleProgress || !moduleProgress.activitiesCompleted || !module.activities) return 0;
    
    const completedActivities = moduleProgress.activitiesCompleted.filter(a => a.status === 'completed').length;
    const totalActivities = module.activities.length;
    
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  };
  
  // Get module status
  const getModuleStatus = (moduleProgress) => {
    if (!moduleProgress) return 'not_started';
    return moduleProgress.status;
  };
  
  // Format status for display
  const formatStatus = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'text-green-600' };
      case 'in_progress':
        return { label: 'In Progress', color: 'text-yellow-600' };
      case 'failed':
        return { label: 'Failed', color: 'text-red-600' };
      default:
        return { label: 'Not Started', color: 'text-gray-600' };
    }
  };

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Module Progress</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const completionPercentage = getCompletionPercentage(moduleProgress, module);
          const status = getModuleStatus(moduleProgress);
          const statusDisplay = formatStatus(status);
          
          return (
            <div key={module.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:mr-4">
                  <h4 className="text-base font-medium text-gray-900">{module.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm ${statusDisplay.color}`}>{statusDisplay.label}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {moduleProgress?.currentScore || 0} points
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <ProgressBar 
                      value={completionPercentage} 
                      variant={status === 'completed' ? 'success' : 'police'} 
                      size="sm" 
                      className="w-full md:w-64" 
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {moduleProgress?.activitiesCompleted?.filter(a => a.status === 'completed').length || 0}/
                      {module.activities?.length || 0} activities completed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Button
                    variant={status === 'not_started' ? 'primary' : 'outline'}
                    size="sm"
                    to={`/modules/${module.id}`}
                  >
                    {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        {modules.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No modules available
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModuleProgress;