/**
 * DecisionPoint Component
 * 
 * This component renders a decision point in a decision-based scenario,
 * displaying the context, options, and handling user choices.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DecisionPoint = ({
  decisionPoint,
  onDecisionMade,
  timeLimit,
  showTimer = true,
  disabled = false,
  className = ''
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!timeLimit || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto-submit or handle timeout
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, timeRemaining]);

  const handleTimeout = () => {
    if (selectedOption) {
      handleSubmitDecision();
    } else {
      // No option selected - could auto-select a default or show timeout message
      onDecisionMade(null, { isTimeout: true });
    }
  };

  const handleOptionSelect = (option) => {
    if (disabled || isSubmitting) return;
    setSelectedOption(option);
  };

  const handleSubmitDecision = async () => {
    if (!selectedOption || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onDecisionMade(selectedOption.id, {
        option: selectedOption,
        timeRemaining,
        isTimeout: false
      });
    } catch (error) {
      console.error('Error submitting decision:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeLimit) return 'text-gray-600';
    const percentage = timeRemaining / timeLimit;
    if (percentage > 0.5) return 'text-green-600';
    if (percentage > 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`decision-point bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header with timer */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {decisionPoint.title}
        </h2>
        {showTimer && timeLimit && (
          <div className={`timer ${getTimerColor()} font-mono text-lg font-bold`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Context and scenario */}
      {decisionPoint.context && (
        <div className="context mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-semibold text-blue-800 mb-2">Context</h3>
          <p className="text-blue-700">{decisionPoint.context}</p>
        </div>
      )}

      {/* Scenario description */}
      <div className="scenario mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Scenario</h3>
        <p className="text-gray-700 leading-relaxed">{decisionPoint.scenario}</p>
      </div>

      {/* Decision options */}
      <div className="options mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">What do you decide?</h3>
        <div className="space-y-3">
          {decisionPoint.options.map((option, index) => (
            <div
              key={option.id}
              className={`option-card p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedOption?.id === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-start">
                <div className={`option-indicator w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                  selectedOption?.id === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption?.id === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="option-text font-medium text-gray-800 mb-1">
                    {option.text}
                  </div>
                  {option.description && (
                    <div className="option-description text-sm text-gray-600">
                      {option.description}
                    </div>
                  )}
                  {option.category && (
                    <div className="option-category mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        option.category === 'escalate' ? 'bg-red-100 text-red-700' :
                        option.category === 'wait' ? 'bg-yellow-100 text-yellow-700' :
                        option.category === 'file_fir' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {option.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmitDecision}
          disabled={!selectedOption || disabled || isSubmitting}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedOption && !disabled && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Make Decision'
          )}
        </button>
      </div>

      {/* Progress indicator */}
      {timeLimit && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeRemaining / timeLimit > 0.5 ? 'bg-green-500' :
                timeRemaining / timeLimit > 0.25 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

DecisionPoint.propTypes = {
  decisionPoint: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    context: PropTypes.string,
    scenario: PropTypes.string.isRequired,
    timeLimit: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      points: PropTypes.number,
      isOptimal: PropTypes.bool
    })).isRequired
  }).isRequired,
  onDecisionMade: PropTypes.func.isRequired,
  timeLimit: PropTypes.number,
  showTimer: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default DecisionPoint;