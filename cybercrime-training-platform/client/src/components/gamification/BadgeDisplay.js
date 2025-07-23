import React from 'react';
import { Badge } from '../ui';

/**
 * Badge Display component for showing earned badges
 * @param {Object} props - Component props
 * @param {Array} props.badges - Array of badge objects
 * @param {number} props.maxDisplay - Maximum number of badges to display
 * @param {boolean} props.showEmpty - Whether to show empty badge placeholders
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Badge Display component
 */
const BadgeDisplay = ({ 
  badges = [], 
  maxDisplay = 5, 
  showEmpty = true,
  className = '' 
}) => {
  // Calculate how many empty badges to show
  const emptyBadges = showEmpty ? Math.max(0, maxDisplay - badges.length) : 0;
  
  // Limit badges to maxDisplay
  const displayBadges = badges.slice(0, maxDisplay);
  
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Earned badges */}
      {displayBadges.map((badge) => (
        <Badge
          key={badge.id}
          imageUrl={badge.imageUrl}
          size="md"
          className="tooltip-container"
        >
          <div className="text-center text-sm">
            <div className="font-medium">{badge.name}</div>
            <div className="tooltip">
              <div className="tooltip-content">
                {badge.description}
              </div>
            </div>
          </div>
        </Badge>
      ))}
      
      {/* Empty badge placeholders */}
      {emptyBadges > 0 && Array.from({ length: emptyBadges }).map((_, index) => (
        <div 
          key={`empty-${index}`} 
          className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </div>
      ))}
      
      {/* More indicator */}
      {badges.length > maxDisplay && (
        <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-600 font-medium">+{badges.length - maxDisplay}</span>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;