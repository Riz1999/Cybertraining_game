import React from 'react';

/**
 * Module Progress Indicator component for displaying module progression status
 * @param {Object} props - Component props
 * @param {number} props.completedModules - Number of completed modules
 * @param {number} props.totalModules - Total number of modules
 * @param {number} props.currentModuleIndex - Current module index (0-based)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Module Progress Indicator component
 */
const ModuleProgressIndicator = ({ 
  completedModules = 0, 
  totalModules = 0, 
  currentModuleIndex = 0,
  className = '' 
}) => {
  // Calculate progress percentage
  const progressPercentage = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100) 
    : 0;
  
  // Generate module indicators
  const moduleIndicators = Array.from({ length: totalModules }, (_, index) => {
    // Determine if module is completed, current, or upcoming
    const isCompleted = index < completedModules;
    const isCurrent = index === currentModuleIndex;
    const isUpcoming = index > currentModuleIndex;
    
    // Determine indicator classes
    let indicatorClasses = 'w-3 h-3 rounded-full';
    
    if (isCompleted) {
      indicatorClasses += ' bg-green-500';
    } else if (isCurrent) {
      indicatorClasses += ' bg-police-blue ring-2 ring-police-blue ring-offset-2';
    } else {
      indicatorClasses += ' bg-gray-300';
    }
    
    return (
      <div 
        key={index} 
        className={`${indicatorClasses} ${isCurrent ? 'z-10' : ''}`}
        title={`Module ${index + 1}`}
      />
    );
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Training Progress</span>
        <span className="text-sm text-gray-500">{progressPercentage}% Complete</span>
      </div>
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gray-200"></div>
        
        {/* Progress bar filled */}
        <div 
          className="absolute top-1.5 left-0 h-0.5 bg-green-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {/* Module indicators */}
        <div className="relative flex justify-between">
          {moduleIndicators}
        </div>
        
        {/* Module labels */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Start</span>
          <span className="text-xs text-gray-500">Finish</span>
        </div>
      </div>
    </div>
  );
};

export default ModuleProgressIndicator;