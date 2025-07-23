import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DragDropActivity = ({ instructions, items, categories, onComplete, disabled = false }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [categorizedItems, setCategorizedItems] = useState({});
  const [uncategorizedItems, setUncategorizedItems] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize uncategorized items
  useEffect(() => {
    if (items && items.length > 0) {
      setUncategorizedItems(items);
      
      // Initialize empty categories
      const initialCategories = {};
      categories.forEach(category => {
        initialCategories[category.id] = [];
      });
      setCategorizedItems(initialCategories);
    }
  }, [items, categories]);

  const handleDragStart = (item) => {
    if (disabled || completed) return;
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (categoryId) => {
    if (!draggedItem || disabled || completed) return;

    // Remove from uncategorized or previous category
    let updatedUncategorized = [...uncategorizedItems];
    let updatedCategories = { ...categorizedItems };
    
    // Check if item is in uncategorized
    const uncategorizedIndex = updatedUncategorized.findIndex(item => item.id === draggedItem.id);
    
    if (uncategorizedIndex !== -1) {
      // Remove from uncategorized
      updatedUncategorized.splice(uncategorizedIndex, 1);
    } else {
      // Find and remove from previous category
      Object.keys(updatedCategories).forEach(catId => {
        updatedCategories[catId] = updatedCategories[catId].filter(item => item.id !== draggedItem.id);
      });
    }
    
    // Add to new category
    updatedCategories[categoryId] = [...updatedCategories[categoryId], draggedItem];
    
    // Update state
    setUncategorizedItems(updatedUncategorized);
    setCategorizedItems(updatedCategories);
    setDraggedItem(null);
  };

  const handleCheck = () => {
    if (disabled || completed) return;
    
    // Calculate score
    let correctCount = 0;
    let totalItems = items.length;
    
    Object.keys(categorizedItems).forEach(categoryId => {
      categorizedItems[categoryId].forEach(item => {
        if (item.category === categoryId) {
          correctCount++;
        }
      });
    });
    
    const calculatedScore = Math.round((correctCount / totalItems) * 10);
    setScore(calculatedScore);
    setShowFeedback(true);
    setCompleted(true);
    
    // Notify parent component
    if (onComplete) {
      onComplete(calculatedScore);
    }
  };

  const allItemsCategorized = uncategorizedItems.length === 0;

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium mb-2">Drag and Drop Activity</h3>
      <p className="text-gray-600 mb-6">{instructions}</p>
      
      {/* Uncategorized items */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Items to Categorize</h4>
        <div 
          className="min-h-[100px] p-4 border border-dashed border-gray-300 rounded-lg flex flex-wrap gap-2"
        >
          {uncategorizedItems.map(item => (
            <div
              key={item.id}
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded cursor-grab"
              draggable={!disabled && !completed}
              onDragStart={() => handleDragStart(item)}
            >
              {item.text}
            </div>
          ))}
          {uncategorizedItems.length === 0 && (
            <p className="text-gray-400 w-full text-center">All items have been categorized</p>
          )}
        </div>
      </div>
      
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {categories.map(category => (
          <div 
            key={category.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 p-3">
              <h4 className="font-medium">{category.title}</h4>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
            <div 
              className="min-h-[150px] p-4 flex flex-wrap gap-2"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(category.id)}
            >
              {categorizedItems[category.id]?.map(item => (
                <div
                  key={item.id}
                  className={`px-3 py-2 rounded cursor-grab ${
                    showFeedback
                      ? item.category === category.id
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                  draggable={!disabled && !completed}
                  onDragStart={() => handleDragStart(item)}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Results</h4>
          <p>You scored {score} out of 10 points.</p>
          {score === 10 ? (
            <p className="text-green-600 mt-2">Perfect! All items were correctly categorized.</p>
          ) : (
            <p className="text-blue-600 mt-2">
              Review the color-coded items: green indicates correct categorization, red indicates incorrect.
            </p>
          )}
        </div>
      )}
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            !allItemsCategorized || disabled || completed
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleCheck}
          disabled={!allItemsCategorized || disabled || completed}
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};

DragDropActivity.propTypes = {
  instructions: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default DragDropActivity;