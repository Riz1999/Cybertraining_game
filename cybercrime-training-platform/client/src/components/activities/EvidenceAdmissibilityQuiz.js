import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EvidenceAdmissibilityQuiz = ({ evidenceItems, instructions, onComplete, disabled = false }) => {
  const [selections, setSelections] = useState({});
  const [admissibilitySelections, setAdmissibilitySelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState({});

  const handleReasonSelection = (itemId, reason) => {
    if (disabled || submitted) return;
    
    setSelections(prev => ({
      ...prev,
      [itemId]: reason
    }));
  };

  const handleAdmissibilitySelection = (itemId, isAdmissible) => {
    if (disabled || submitted) return;
    
    setAdmissibilitySelections(prev => ({
      ...prev,
      [itemId]: isAdmissible
    }));
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;

    // Calculate score and generate feedback
    let correctCount = 0;
    const newFeedback = {};

    evidenceItems.forEach(item => {
      // Check if both admissibility and reason are correct
      const isAdmissibilityCorrect = admissibilitySelections[item.id] === item.isAdmissible;
      const isReasonCorrect = selections[item.id] === item.correctReason;
      
      // Only count as correct if both admissibility and reason are correct
      const isFullyCorrect = isAdmissibilityCorrect && isReasonCorrect;
      
      if (isFullyCorrect) {
        correctCount++;
      }
      
      newFeedback[item.id] = {
        isAdmissibilityCorrect,
        isReasonCorrect,
        isFullyCorrect
      };
    });

    const calculatedScore = Math.round((correctCount / evidenceItems.length) * 25);
    
    setFeedback(newFeedback);
    setScore(calculatedScore);
    setSubmitted(true);

    if (correctCount === evidenceItems.length) {
      setCompleted(true);
      if (onComplete) {
        onComplete(calculatedScore);
      }
    }
  };

  const handleRetry = () => {
    if (disabled) return;
    
    setSubmitted(false);
    setFeedback({});
  };

  const handleComplete = () => {
    if (disabled) return;
    
    setCompleted(true);
    if (onComplete) {
      onComplete(score);
    }
  };

  const allSelectionsComplete = () => {
    return evidenceItems.every(item => 
      admissibilitySelections[item.id] !== undefined && 
      selections[item.id] !== undefined
    );
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <p className="text-gray-700">{instructions}</p>
      </div>

      <div className="space-y-6 mb-6">
        {evidenceItems.map((item) => {
          const itemFeedback = submitted ? feedback[item.id] : null;
          
          return (
            <div 
              key={item.id} 
              className={`p-4 border rounded-lg ${
                submitted && itemFeedback
                  ? itemFeedback.isFullyCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <h4 className="font-medium mb-3">Evidence: {item.description}</h4>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Is this evidence admissible in court?</p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`${item.id}-admissible-yes`}
                      name={`${item.id}-admissible`}
                      checked={admissibilitySelections[item.id] === true}
                      onChange={() => handleAdmissibilitySelection(item.id, true)}
                      disabled={disabled || submitted}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`${item.id}-admissible-yes`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`${item.id}-admissible-no`}
                      name={`${item.id}-admissible`}
                      checked={admissibilitySelections[item.id] === false}
                      onChange={() => handleAdmissibilitySelection(item.id, false)}
                      disabled={disabled || submitted}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`${item.id}-admissible-no`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      No
                    </label>
                  </div>
                </div>
                
                {submitted && itemFeedback && !itemFeedback.isAdmissibilityCorrect && (
                  <p className="mt-1 text-sm text-red-600">
                    Incorrect. This evidence is {item.isAdmissible ? 'admissible' : 'not admissible'}.
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Select the reason:</p>
                <div className="space-y-2">
                  {item.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={`${item.id}-reason-${option}`}
                        name={`${item.id}-reason`}
                        checked={selections[item.id] === option}
                        onChange={() => handleReasonSelection(item.id, option)}
                        disabled={disabled || submitted}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={`${item.id}-reason-${option}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                
                {submitted && itemFeedback && !itemFeedback.isReasonCorrect && (
                  <p className="mt-1 text-sm text-red-600">
                    Incorrect reason. The correct reason is: {item.correctReason}
                  </p>
                )}
              </div>
              
              {submitted && itemFeedback && itemFeedback.isFullyCorrect && (
                <div className="mt-3 p-2 bg-green-100 text-green-700 text-sm rounded">
                  Correct! This evidence is {item.isAdmissible ? 'admissible' : 'not admissible'} because {item.correctReason}.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {submitted && (
        <div className={`p-4 mb-6 rounded-lg ${
          score === 25 
            ? 'bg-green-50 border border-green-200' 
            : score >= 15
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            score === 25 
              ? 'text-green-800' 
              : score >= 15
                ? 'text-yellow-800'
                : 'text-red-800'
          }`}>
            Evidence Assessment
          </h4>
          <p className={`${
            score === 25 
              ? 'text-green-700' 
              : score >= 15
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}>
            {score === 25 
              ? 'Excellent! You correctly assessed all evidence items.' 
              : score >= 15
                ? 'Good effort! You correctly assessed most evidence items. Review the feedback above.'
                : 'Your evidence assessment needs improvement. Review the feedback above and try again.'}
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
              disabled={disabled || !allSelectionsComplete()}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled || !allSelectionsComplete() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit Assessment
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

EvidenceAdmissibilityQuiz.propTypes = {
  evidenceItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isAdmissible: PropTypes.bool.isRequired,
      correctReason: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default EvidenceAdmissibilityQuiz;