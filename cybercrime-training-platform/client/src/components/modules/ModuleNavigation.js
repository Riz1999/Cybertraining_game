import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, ProgressBar } from '../ui';
import ModulePrerequisites from './ModulePrerequisites';
import ModuleProgressIndicator from './ModuleProgressIndicator';

/**
 * Module Navigation component for displaying and navigating between modules
 * @param {Object} props - Component props
 * @param {Array} props.modules - Array of module objects
 * @param {Object} props.userProgress - User progress object
 * @param {number} props.userXP - User's current XP
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Navigation component
 */
const ModuleNavigation = ({ modules = [], userProgress = {}, userXP = 0, className = '' }) => {
  // Get module status based on progress and prerequisites
  const getModuleStatus = (module) => {
    // If module is not available due to prerequisites, it's locked
    if (!module.isAvailable) {
      return 'locked';
    }
    
    // If module has progress, use that status
    if (module.status) {
      return module.status;
    }
    
    // Otherwise, it's not started
    return 'not_started';
  };
  
  // Get module badge based on status
  const getModuleStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
      default:
        return <Badge variant="primary">Not Started</Badge>;
    }
  };
  
  // Calculate completion percentage for a module
  const getCompletionPercentage = (module) => {
    if (!module.progress || !module.progress.activitiesCompleted) {
      return 0;
    }
    
    const completedActivities = module.progress.activitiesCompleted.filter(a => a.status === 'completed').length;
    const totalActivities = module.activities ? module.activities.length : 0;
    
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  };
  
  // Calculate overall training progress
  const calculateTrainingProgress = () => {
    if (!modules || modules.length === 0) {
      return {
        completedModules: 0,
        totalModules: 0,
        currentModuleIndex: 0
      };
    }
    
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const totalModules = modules.length;
    
    // Find current module index (first in_progress or first not_started if none in progress)
    let currentModuleIndex = modules.findIndex(m => m.status === 'in_progress');
    
    if (currentModuleIndex === -1) {
      // If no module is in progress, find the first not_started module
      currentModuleIndex = modules.findIndex(m => m.status === 'not_started' && m.isAvailable);
      
      // If all modules are completed or locked, set to last module
      if (currentModuleIndex === -1) {
        currentModuleIndex = completedModules;
      }
    }
    
    return {
      completedModules,
      totalModules,
      currentModuleIndex
    };
  };
  
  // Get module prerequisites
  const getModulePrerequisites = (module) => {
    if (!module.prerequisites) {
      return null;
    }
    
    return {
      meetsPrerequisites: module.isAvailable,
      missingPrerequisites: module.missingPrerequisites || []
    };
  };

  // Calculate training progress
  const trainingProgress = calculateTrainingProgress();

  return (
    <div className={className}>
      {/* Overall training progress indicator */}
      <ModuleProgressIndicator 
        completedModules={trainingProgress.completedModules}
        totalModules={trainingProgress.totalModules}
        currentModuleIndex={trainingProgress.currentModuleIndex}
        className="mb-6 bg-white p-4 rounded-lg shadow-sm"
      />
      
      <div className="space-y-6">
        {modules.map((module, index) => {
          const status = getModuleStatus(module);
          const completionPercentage = getCompletionPercentage(module);
          const isLocked = status === 'locked';
          const prerequisites = getModulePrerequisites(module);
          
          return (
            <div key={module.id} className="space-y-3">
              <Card className={`transition-shadow hover:shadow-md ${isLocked ? 'opacity-90 border-l-4 border-gray-300' : ''}`}>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-police-blue rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white text-sm font-medium">{index + 1}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                        <div className="ml-3">
                          {getModuleStatusBadge(status)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-1">{module.description}</p>
                      
                      <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500">
                        <span className="mr-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.estimatedDuration} min
                        </span>
                        <span className="mr-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {module.activities ? module.activities.length : 0} activities
                        </span>
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {module.badgeReward.name}
                        </span>
                      </div>
                      
                      {!isLocked && status !== 'not_started' && (
                        <div className="mt-3">
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
                    </div>
                    
                    <div className="flex items-center">
                      {isLocked ? (
                        <button 
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed flex items-center"
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
                          className={`px-4 py-2 rounded-md flex items-center ${
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
                </div>
              </Card>
              
              {/* Show prerequisites if module is locked */}
              {isLocked && (
                <ModulePrerequisites 
                  prerequisites={prerequisites}
                  userXP={userXP}
                />
              )}
            </div>
          );
        })}
        
        {modules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No modules available
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleNavigation;