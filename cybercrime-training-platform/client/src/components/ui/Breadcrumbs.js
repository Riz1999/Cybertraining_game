import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumbs component for navigation hierarchy
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with label and path
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.separator - Custom separator character
 * @returns {React.ReactElement} Breadcrumbs component
 */
const Breadcrumbs = ({ items = [], className = '', separator = '/' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-police-blue hover:text-blue-700 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;