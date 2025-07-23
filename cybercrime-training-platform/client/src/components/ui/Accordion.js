import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Accordion = ({ title, children, defaultOpen = false, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg mb-4 ${disabled ? 'opacity-70' : ''}`}>
      <button
        className={`w-full flex justify-between items-center p-4 text-left font-medium ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
        } ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={toggleAccordion}
        disabled={disabled}
      >
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Accordion;