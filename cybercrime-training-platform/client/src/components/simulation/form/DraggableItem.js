import React from 'react';
import PropTypes from 'prop-types';

/**
 * DraggableItem component
 * 
 * This component renders a draggable information item that can be dropped into form fields.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - The draggable item data
 */
const DraggableItem = ({ item }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    // Reset visual feedback
    e.target.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="draggable-item bg-white border border-gray-300 rounded-lg p-3 cursor-move hover:border-blue-400 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {item.label}
          </div>
          <div className="text-sm text-gray-600">
            {item.value}
          </div>
        </div>
        
        <div className="ml-2 text-gray-400">
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
            />
          </svg>
        </div>
      </div>
      
      {item.category && (
        <div className="mt-2">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
      )}
    </div>
  );
};

DraggableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    category: PropTypes.string
  }).isRequired
};

export default DraggableItem;