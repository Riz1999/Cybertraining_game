import React from 'react';

/**
 * Progress bar component for displaying completion status
 * @param {Object} props - Component props
 * @param {number} props.value - Current progress value (0-100)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Progress bar variant (default, success, warning, danger)
 * @param {boolean} props.showLabel - Whether to show the percentage label
 * @param {string} props.size - Progress bar size (sm, md, lg)
 * @param {boolean} props.animated - Whether to show animation
 * @returns {React.ReactElement} Progress bar component
 */
const ProgressBar = ({
  value = 0,
  className = '',
  variant = 'default',
  showLabel = false,
  size = 'md',
  animated = false,
}) => {
  // Ensure value is between 0 and 100
  const progress = Math.min(Math.max(value, 0), 100);

  // Define variant styles
  const variantStyles = {
    default: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    police: 'bg-police-blue',
  };

  // Define size styles
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="text-sm font-medium text-gray-700">{Math.round(progress)}%</div>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`${variantStyles[variant] || variantStyles.default} rounded-full ${
            sizeStyles[size] || sizeStyles.md
          } ${animated ? 'transition-all duration-500 ease-in-out' : ''}`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;