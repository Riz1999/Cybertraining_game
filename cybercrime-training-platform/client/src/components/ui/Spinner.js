import React from 'react';

/**
 * Spinner component for loading states
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.color - Spinner color (default, primary, white)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Spinner component
 */
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Define size styles
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Define color styles
  const colorStyles = {
    default: 'text-gray-600',
    primary: 'text-police-blue',
    white: 'text-white',
    gold: 'text-police-gold',
  };

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="loading">
      <svg
        className={`animate-spin ${sizeStyles[size] || sizeStyles.md} ${
          colorStyles[color] || colorStyles.primary
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;