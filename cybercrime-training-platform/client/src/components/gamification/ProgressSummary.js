import React from 'react';
import { Card } from '../ui';

/**
 * Progress Summary component for displaying user's overall progress
 * @param {Object} props - Component props
 * @param {Object} props.statistics - User statistics object
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Progress Summary component
 */
const ProgressSummary = ({ statistics = {}, className = '' }) => {
  // Format time spent
  const formatTimeSpent = (seconds) => {
    if (!seconds) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes} min`;
  };
  
  // Stats to display
  const stats = [
    {
      label: 'Modules Completed',
      value: statistics.completedModules || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Modules In Progress',
      value: statistics.inProgressModules || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Badges Earned',
      value: statistics.badgesCount || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Average Score',
      value: `${statistics.averageScore || 0}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      label: 'Total Time Spent',
      value: formatTimeSpent(statistics.totalTimeSpent),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Completion',
      value: `${statistics.completionPercentage || 0}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Progress Summary</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-lg font-medium text-gray-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressSummary;