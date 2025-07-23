import React from 'react';

/**
 * Card component for displaying content in a contained box
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.header - Card header content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {boolean} props.hover - Whether to apply hover effects
 * @returns {React.ReactElement} Card component
 */
const Card = ({
  children,
  className = '',
  header,
  footer,
  hover = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg' : ''
      } ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">{header}</div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>
      )}
    </div>
  );
};

export default Card;