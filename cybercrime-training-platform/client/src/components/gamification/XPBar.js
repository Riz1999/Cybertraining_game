import React from 'react';
import { ProgressBar } from '../ui';

/**
 * XP Bar component for displaying user level and XP progress
 * @param {Object} props - Component props
 * @param {number} props.level - User's current level
 * @param {number} props.progress - Progress percentage to next level (0-100)
 * @param {number} props.xpForNextLevel - XP needed for next level
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} XP Bar component
 */
const XPBar = ({ level, progress, xpForNextLevel, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-police-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
            {level}
          </div>
          <span className="font-medium text-gray-700">Level {level}</span>
        </div>
        {xpForNextLevel > 0 && (
          <span className="text-sm text-gray-500">{xpForNextLevel} XP to next level</span>
        )}
      </div>
      
      <ProgressBar
        value={progress}
        variant="police"
        size="md"
        animated
      />
      
      {xpForNextLevel === 0 && (
        <div className="mt-2 text-center text-sm text-gray-600">
          Maximum level reached!
        </div>
      )}
    </div>
  );
};

export default XPBar;