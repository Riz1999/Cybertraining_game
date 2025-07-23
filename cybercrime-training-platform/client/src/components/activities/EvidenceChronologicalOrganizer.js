import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EvidenceChronologicalOrganizer = ({ evidenceItems, instructions, onComplete, disabled = false }) => {
  const [items, setItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Initialize items
  useEffect(() => {
    if (evidenceItems && evidenceItems.length > 0) {
      // Shuffle the evidence items
      const shuffledItems = [...evidenceItems].sort(() => Math.random() - 0.5);
      setItems(shuffledItems);
    }
  }, [evidenceItems]);

  const moveItemUp = (index) => {
    if (disabled || submitted || index === 0) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
  };

  const moveItemDown = (index) => {
    if (disabled || submitted || index === items.length - 1) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;

    // Check if the order is correct
    let correctCount = 0;
    const results = items.map((item, index) => {
      const isCorrect = item.correctPosition === index + 1;
      if (isCorrect) {
        correctCount++;
      }
      return {
        ...item,
        isCorrect,
      };
    });

    // Calculate score based on correct positions
    const calculatedScore = Math.round((correctCount / items.length) * 25);
    
    setScore(calculatedScore);
    setSubmitted(true);
    
    // Generate feedback
    if (correctCount === items.length) {
      setFeedback({
        type: 'success',
        message: 'Perfect! You have correctly organized all evidence items in chronological order.'
      });
      setCompleted(true);
      if (onComplete) {
        onComplete(calculatedScore);
      }
    } else if (correctCount >= items.length * 0.7) {
      setFeedback({
        type: 'partial',
        message: `Good job! You have correctly placed ${correctCount} out of ${items.length} evidence items. Review the correct order below.`
      });
    } else {
      setFeedback({
        type: 'error',
        message: `You have correctly placed ${correctCount} out of ${items.length} evidence items. Review the correct order below.`
      });
    }
  };

  const handleRetry = () => {
    if (disabled) return;
    
    // Shuffle the evidence items again
    const shuffledItems = [...evidenceItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setSubmitted(false);
    setFeedback(null);
  };

  const handleComplete = () => {
    if (disabled) return;
    
    setCompleted(true);
    if (onComplete) {
      onComplete(score);
    }
  };

  // Sort items by correctPosition for the solution display
  const sortedItems = [...evidenceItems].sort((a, b) => a.correctPosition - b.correctPosition);

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <p className="text-gray-700">{instructions}</p>
      </div>

      {!submitted ? (
        <div className="space-y-2 mb-6">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg mb-2 bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-800 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.timestamp}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={disabled || submitted || index === 0}
                    className={`p-1 rounded-full ${
                      index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={disabled || submitted || index === items.length - 1}
                    className={`p-1 rounded-full ${
                      index === items.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Correct Chronological Order:</h4>
          <div className="space-y-2">
            {sortedItems.map((item, index) => {
              const userPosition = items.findIndex(i => i.id === item.id) + 1;
              const isCorrect = userPosition === item.correctPosition;
              
              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.timestamp}</p>
                    </div>
                    {!isCorrect && (
                      <div className="ml-4 px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        Your position: {userPosition}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {feedback && (
        <div className={`p-4 mb-6 rounded-lg ${
          feedback.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : feedback.type === 'partial'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`${
            feedback.type === 'success' 
              ? 'text-green-700' 
              : feedback.type === 'partial'
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}>
            {feedback.message}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div className="mb-4 sm:mb-0">
          {submitted && (
            <div className="text-lg font-medium">
              Score: {score}/25 ({Math.round((score / 25) * 100)}%)
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          {submitted && !completed && (
            <button
              onClick={handleRetry}
              disabled={disabled}
              className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Retry
            </button>
          )}
          
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit
            </button>
          ) : !completed ? (
            <button
              onClick={handleComplete}
              disabled={disabled}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Complete Activity
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
              Activity Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EvidenceChronologicalOrganizer.propTypes = {
  evidenceItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      correctPosition: PropTypes.number.isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default EvidenceChronologicalOrganizer;