import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';

/**
 * DecisionPointComponent
 * 
 * Displays a decision point with options and context information.
 * Used in the complaint delay scenario system.
 */
const DecisionPointComponent = ({ decisionPoint, onDecisionMade }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Handle decision submission
  const handleSubmitDecision = () => {
    if (!selectedOption) return;

    setFeedback({
      text: selectedOption.feedback,
      isCorrect: selectedOption.isCorrect
    });
    setShowFeedback(true);

    // Notify parent component of decision
    if (onDecisionMade) {
      onDecisionMade(selectedOption);
    }
  };

  // Handle continue after feedback
  const handleContinue = () => {
    if (onDecisionMade && selectedOption) {
      onDecisionMade(selectedOption, true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{decisionPoint.title}</h3>
        <p className="text-gray-700 mb-6">{decisionPoint.description}</p>

        {decisionPoint.contextInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Context:</strong> {decisionPoint.contextInfo}
                </p>
              </div>
            </div>
          </div>
        )}

        {!showFeedback ? (
          <>
            <div className="space-y-4 mb-6">
              {decisionPoint.options.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedOption && selectedOption.id === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedOption && selectedOption.id === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption && selectedOption.id === option.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-800">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitDecision}
                disabled={!selectedOption}
                variant="primary"
              >
                Submit Decision
              </Button>
            </div>
          </>
        ) : (
          <div className={`border rounded-lg p-6 mb-6 ${
            feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`text-lg font-semibold mb-2 ${
              feedback.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {feedback.isCorrect ? 'Correct Decision' : 'Incorrect Decision'}
            </h4>
            <p className={`mb-4 ${
              feedback.isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {feedback.text}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={handleContinue}
                variant={feedback.isCorrect ? 'success' : 'primary'}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DecisionPointComponent.propTypes = {
  decisionPoint: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    contextInfo: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
        feedback: PropTypes.string.isRequired,
        isCorrect: PropTypes.bool.isRequired
      })
    ).isRequired
  }).isRequired,
  onDecisionMade: PropTypes.func
};

export default DecisionPointComponent;