import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ResponseOptions component
 * 
 * This component renders a set of response options for the user to choose from.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.options - The response options
 * @param {Function} props.onSelect - Callback when an option is selected
 * @param {boolean} props.disabled - Whether the options are disabled
 * @param {string} props.selectedId - The ID of the selected option
 */
const ResponseOptions = ({ 
  options, 
  onSelect, 
  disabled = false,
  selectedId = null
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (!options || options.length === 0) {
    return null;
  }

  // Handle option selection
  const handleSelect = (option) => {
    if (disabled) return;
    
    if (onSelect) {
      onSelect(option);
    }
  };

  // Handle option hover
  const handleMouseEnter = (optionId) => {
    setHoveredId(optionId);
  };

  // Handle option hover end
  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  return (
    <div className="response-options mt-4">
      <div className="options-container space-y-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isHovered = hoveredId === option.id;
          
          return (
            <button
              key={option.id}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
                }
                ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                ${isHovered ? 'shadow-md' : ''}
              `}
              onClick={() => handleSelect(option)}
              disabled={disabled}
              onMouseEnter={() => handleMouseEnter(option.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="option-text">{option.text}</div>
              
              {/* Show feedback if option is selected */}
              {isSelected && option.feedback && (
                <div className={`
                  mt-2 text-sm
                  ${isSelected ? 'text-blue-100' : 'text-gray-500'}
                `}>
                  {option.feedback}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ResponseOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      feedback: PropTypes.string
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selectedId: PropTypes.string
};

export default ResponseOptions;