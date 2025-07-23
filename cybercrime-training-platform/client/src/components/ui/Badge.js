import React from 'react';

/**
 * Badge component for displaying achievements or status indicators
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge text or content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Badge variant (default, success, warning, danger, info)
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {string} props.imageUrl - URL to badge image
 * @returns {React.ReactElement} Badge component
 */
const Badge = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  imageUrl,
}) => {
  // Define variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    police: 'bg-police-blue text-white',
    gold: 'bg-police-gold text-police-blue',
  };

  // Define size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  // If imageUrl is provided, render badge with image
  if (imageUrl) {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt="Badge"
            className={`
              rounded-full border-2 border-police-gold
              ${size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-24 h-24' : 'w-16 h-16'}
            `}
          />
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <div className="bg-police-blue rounded-full p-1 border-2 border-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
        {children && <span className="mt-2 text-center">{children}</span>}
      </div>
    );
  }

  // Otherwise render text badge
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full
        ${variantStyles[variant] || variantStyles.default}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;