import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar } from '../ui';

/**
 * Module Intro component for displaying module introduction and starting a module
 * @param {Object} props - Component props
 * @param {Object} props.module - Module object
 * @param {Object} props.progress - Module progress object
 * @param {number} props.moduleNumber - Module number in sequence
 * @param {Function} props.onStart - Function to call when starting the module
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Intro component
 */
const ModuleIntro = ({ 
  module, 
  progress, 
  moduleNumber = 1, 
  onStart, 
  loading = false, 
  className = '' 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    if (module) {
      setTimeout(() => {
        setAnimateIn(true);
      }, 100);
    }
  }, [module]);

  if (!module) {
    return null;
  }

  // Calculate completion percentage if there's progress
  const getCompletionPercentage = () => {
    if (!progress || !progress.activitiesCompleted) {
      return 0;
    }
    
    const completedActivities = progress.activitiesCompleted.filter(a => a.status === 'completed').length;
    const totalActivities = module.activities ? module.activities.length : 0;
    
    return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  };

  const completionPercentage = getCompletionPercentage();
  const hasProgress = completionPercentage > 0;

  return (
    <Card className={`${className} overflow-hidden transition-all duration-500 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
      <div className="bg-police-blue text-white p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-police-blue text-lg font-bold">{moduleNumber}</span>
          </div>
          <h2 className="text-2xl font-bold">{module.title}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Module badge and info */}
          <div className="mb-6 md:mb-0 md:mr-6 md:w-1/3 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-police-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4 border-4 border-police-blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-police-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <div className="flex flex-wrap items-center justify-center mb-4 space-x-2">
              <Badge variant="police">
                {module.metadata?.difficulty || 'Beginner'}
              </Badge>
              <Badge variant="secondary">
                {module.estimatedDuration} min
              </Badge>
            </div>
            
            {/* Badge reward */}
            {module.badgeReward && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 w-full">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Badge Reward</h3>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{module.badgeReward.name}</div>
                    <div className="text-xs text-gray-600">{module.badgeReward.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Module content */}
          <div className="flex-1">
            <p className="text-gray-600 mb-6 text-lg">{module.description}</p>
            
            {/* Module activities count */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Module Activities</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{module.activities?.length || 0} activities to complete</span>
                {hasProgress && (
                  <span className="text-sm font-medium text-police-blue">{completionPercentage}% Complete</span>
                )}
              </div>
              
              {hasProgress && (
                <div className="mt-2">
                  <ProgressBar 
                    value={completionPercentage} 
                    variant="police" 
                    size="md" 
                  />
                </div>
              )}
            </div>
            
            {/* Module objectives - collapsible */}
            <div className="mb-6">
              <button 
                className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 mb-2 focus:outline-none"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>Learning Objectives</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                  {module.objectives?.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Start button */}
            <div className="flex justify-end">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onStart}
                disabled={loading}
                className="flex items-center px-8 py-3 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : hasProgress ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Continue Module
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Module
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModuleIntro;