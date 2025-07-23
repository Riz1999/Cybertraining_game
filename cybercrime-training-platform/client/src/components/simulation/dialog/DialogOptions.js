import React from 'react';
import PropTypes from 'prop-types';

/**
 * DialogOptions component
 * 
 * This component renders a list of dialog options for the user to choose from.
 */
const DialogOptions = ({ options, onOptionSelected }) => {
  if (!options || options.length === 0) {
    return (
      <div className="dialog-options-empty text-center p-4">
        <p className="text-gray-500">No options available</p>
      </div>
    );
  }
  
  return (
    <div className="dialog-options">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Choose your response:</h4>
      <div className="options-list space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            className="option-button w-full text-left p-3 rounded-lg bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
            onClick={() => onOptionSelected(option.value)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

DialogOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })
  ).isRequired,
  onOptionSelected: PropTypes.func.isRequired
};

export default DialogOptions;