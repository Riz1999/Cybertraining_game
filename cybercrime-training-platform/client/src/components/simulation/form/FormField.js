import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * FormField component
 * 
 * This component renders a form field that can accept dragged items.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.field - The field configuration
 * @param {string} props.value - The current field value
 * @param {boolean} props.isFilled - Whether the field has been filled
 * @param {boolean} props.isRequired - Whether the field is required
 * @param {string} props.error - Error message if validation failed
 * @param {Function} props.onDrop - Callback when an item is dropped on the field
 */
const FormField = ({
  field,
  value,
  isFilled,
  isRequired,
  error,
  onDrop
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    if (isFilled) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (isFilled) return;
    
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      onDrop(itemId);
    }
  };
  
  // Determine field state classes
  const getFieldStateClasses = () => {
    if (error) {
      return 'bg-red-50 border-red-300';
    }
    if (isDragOver && !isFilled) {
      return 'bg-green-50 border-green-300';
    }
    if (isFilled) {
      return 'bg-blue-50 border-blue-300';
    }
    if (!isFilled) {
      return 'bg-gray-50 border-gray-300 border-dashed';
    }
    return 'bg-gray-100 border-gray-300';
  };
  
  return (
    <div className="form-field mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`form-field-input min-h-[50px] p-3 border rounded-md ${getFieldStateClasses()} transition-colors`}
      >
        {isFilled ? (
          <div className="text-sm font-medium text-gray-900">{value}</div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            {isDragOver ? 'Drop here' : 'Drag information here'}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

FormField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isRequired: PropTypes.bool
  }).isRequired,
  value: PropTypes.string,
  isFilled: PropTypes.bool,
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  onDrop: PropTypes.func.isRequired
};

export default FormField;