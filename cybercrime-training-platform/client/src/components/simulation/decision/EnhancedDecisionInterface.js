import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import DecisionFeedback from './DecisionFeedback';

/**
 * EnhancedDecisionInterface Component
 * 
 * This component provides an enhanced decision-making interface for the complaint delay scenario,
 * with option selection (Escalate, Wait, File FIR), consequence visualization, and feedback.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.decisionPoint - The decision point data
 * @param {Function} props.onDecisionMade - Callback when a decision is made
 * @param {boolean} props.showTimer - Whether to show a timer
 * @param {number} props.timeLimit - Time limit in seconds
 */
const EnhancedDecisionInterface = ({ 
  decisionPoint, 
  onDecisionMade,
  showTimer = false,
  timeLimit = null
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isSubmitting) return;
    setSelectedOption(option);
  };

  // Handle decision submission
  const handleSubmitDecision = async () => {
    if (!selectedOption || isSubmitting) return;

    setIsSubmitting(true);
    
    // Evaluate the decision
    const result = {
      points: selectedOption.points,
      feedback: selectedOption.feedback,
      isOptimal: selectedOption.isOptimal || false,
      consequences: selectedOption.consequences || [],
      nextDecisionId: selectedOption.nextDecisionId
    };
    
    setEvaluation(result);
    setShowFeedback(true);
    setIsSubmitting(false);

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

  // Get category badge style
  const getCategoryBadgeStyle = (category) => {
    switch (category) {
      case 'escalate':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'wait':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'file_fir':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Format category label
  const formatCategoryLabel = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {!showFeedback ? (
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{decisionPoint.title}</h3>
          <p className="text-gray-700 mb-6">{decisionPoint.description}</p>

          {/* Context information */}
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

          {/* Decision options */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Make Your Decision:</h4>
            <div className="space-y-4">
              {decisionPoint.options.map((option) => (
                <div
                  key={option.id}
                  className={`border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedOption && selectedOption.id === option.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center mr-3 ${
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
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h5 className="text-lg font-medium text-gray-900 mb-1 sm:mb-0">{option.text}</h5>
                          {option.category && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeStyle(option.category)}`}>
                              {formatCategoryLabel(option.category)}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-gray-600 mt-1">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitDecision}
              disabled={!selectedOption || isSubmitting}
              variant="primary"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Decision'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <DecisionFeedback
          evaluation={evaluation}
          option={selectedOption}
          onContinue={handleContinue}
          showConsequences={true}
        />
      )}
    </div>
  );
};

EnhancedDecisionInterface.propTypes = {
  decisionPoint: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    contextInfo: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        description: PropTypes.string,
        value: PropTypes.string,
        points: PropTypes.number,
        feedback: PropTypes.string,
        isCorrect: PropTypes.bool,
        isOptimal: PropTypes.bool,
        category: PropTypes.string,
        consequences: PropTypes.array
      })
    ).isRequired
  }).isRequired,
  onDecisionMade: PropTypes.func.isRequired,
  showTimer: PropTypes.bool,
  timeLimit: PropTypes.number
};

export default EnhancedDecisionInterface;