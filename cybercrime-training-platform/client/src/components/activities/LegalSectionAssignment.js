import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LegalSectionAssignment = ({ legalSections, instructions, onComplete, disabled = false }) => {
  const [selections, setSelections] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Initialize selections with empty values
    const initialSelections = {};
    legalSections.forEach(section => {
      initialSelections[section.id] = '';
    });
    setSelections(initialSelections);
  }, [legalSections]);

  const handleSelectionChange = (sectionId, value) => {
    if (disabled || submitted) return;
    
    setSelections(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;

    // Calculate score and generate feedback
    let correctCount = 0;
    const newFeedback = {};

    legalSections.forEach(section => {
      const isCorrect = selections[section.id] === section.correctSection;
      if (isCorrect) {
        correctCount++;
      }
      newFeedback[section.id] = {
        isCorrect,
        message: isCorrect 
          ? `Correct! ${section.explanation}`
          : `Incorrect. The correct section is ${section.correctSection}. ${section.explanation}`
      };
    });

    const calculatedScore = Math.round((correctCount / legalSections.length) * 25);
    
    setFeedback(newFeedback);
    setScore(calculatedScore);
    setSubmitted(true);

    if (correctCount === legalSections.length) {
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

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <p className="text-gray-700">{instructions}</p>
      </div>

      <div className="space-y-6 mb-6">
        {legalSections.map((section) => (
          <div 
            key={section.id} 
            className={`p-4 border rounded-lg ${
              submitted && feedback[section.id]
                ? feedback[section.id].isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <h4 className="font-medium mb-2">Offense: {section.offense}</h4>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select the appropriate legal section:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {section.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`${section.id}-${option}`}
                      name={section.id}
                      value={option}
                      checked={selections[section.id] === option}
                      onChange={() => handleSelectionChange(section.id, option)}
                      disabled={disabled || submitted}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`${section.id}-${option}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {submitted && feedback[section.id] && (
              <div className={`mt-2 text-sm ${
                feedback[section.id].isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {feedback[section.id].message}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div className="mb-4 sm:mb-0">
          {submitted && (
            <div className="text-lg font-medium">
              Score: {score}/25 ({Math.round((score / 25) * 100)}%)
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          {submitted && !completed && score < 25 && (
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
              disabled={disabled || Object.values(selections).some(val => !val)}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled || Object.values(selections).some(val => !val) ? 'opacity-50 cursor-not-allowed' : ''
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

LegalSectionAssignment.propTypes = {
  legalSections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      offense: PropTypes.string.isRequired,
      correctSection: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      explanation: PropTypes.string.isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default LegalSectionAssignment;