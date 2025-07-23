import React from 'react';
import PropTypes from 'prop-types';
import DraggableItem from './DraggableItem';

/**
 * DraggableInfoPanel component
 * 
 * This component displays a panel of draggable information items.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - The draggable information items
 * @param {Object} props.scenario - The scenario context
 */
const DraggableInfoPanel = ({
  items,
  scenario
}) => {
  return (
    <div className="draggable-info-panel">
      {scenario && (
        <div className="scenario-context mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Case Information</h4>
          <p className="text-sm text-blue-700">{scenario.description}</p>
        </div>
      )}
      
      <div className="mb-3 text-sm font-medium text-gray-700">
        Available Information Items ({items.length})
      </div>
      
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">All information has been used</p>
          </div>
        )}
      </div>
    </div>
  );
};

DraggableInfoPanel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    category: PropTypes.string
  })).isRequired,
  scenario: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string
  })
};

export default DraggableInfoPanel;