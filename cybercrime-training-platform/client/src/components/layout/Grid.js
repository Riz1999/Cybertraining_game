import React from 'react';

/**
 * Responsive grid component with configurable columns
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.cols - Number of columns on large screens (default: 3)
 * @param {number} props.smCols - Number of columns on small screens (default: 1)
 * @param {number} props.mdCols - Number of columns on medium screens (default: 2)
 * @param {string} props.gap - Gap between grid items (default: 'gap-6')
 * @returns {React.ReactElement} Grid component
 */
const Grid = ({
  children,
  className = '',
  cols = 3,
  smCols = 1,
  mdCols = 2,
  gap = 'gap-6',
}) => {
  // Generate grid template columns based on props
  const getGridCols = (numCols) => {
    return `grid-cols-${numCols}`;
  };

  return (
    <div
      className={`grid ${getGridCols(smCols)} sm:${getGridCols(mdCols)} lg:${getGridCols(
        cols
      )} ${gap} ${className}`}
    >
      {children}
    </div>
  );
};

export default Grid;