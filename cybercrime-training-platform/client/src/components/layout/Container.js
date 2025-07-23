import React from 'react';

/**
 * Responsive container component that centers content and applies consistent padding
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fluid - Whether the container should be full-width
 * @returns {React.ReactElement} Container component
 */
const Container = ({ children, className = '', fluid = false }) => {
  return (
    <div
      className={`${
        fluid ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;