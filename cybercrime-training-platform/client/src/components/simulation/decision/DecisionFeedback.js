/**
 * DecisionFeedback Component
 * 
 * This component displays feedback after a decision is made,
 * showing consequences, points earned, and next steps.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DecisionFeedback = ({
  evaluation,
  option,
  onContinue,
  showConsequences = true,
  autoAdvanceDelay = null,
  className = ''
}) => {
  const [visibleConsequences, setVisibleConsequences] = useState([]);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(autoAdvanceDelay);

  // Show consequences with delays
  useEffect(() => {
    if (!showConsequences || !evaluation.consequences) return;

    const timers = [];
    evaluation.consequences.forEach((consequence, index) => {
      const delay = consequence.delay || index * 1000; // Default 1s between consequences
      const timer = setTimeout(() => {
        setVisibleConsequences(prev => [...prev, consequence]);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [evaluation.consequences, showConsequences]);

  // Auto-advance timer
  useEffect(() => {
    if (!autoAdvanceDelay) return;

    const timer = setInterval(() => {
      setAutoAdvanceTimer(prev => {
        if (prev <= 1) {
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoAdvanceDelay, onContinue]);

  const getScoreColor = (points) => {
    if (points > 0) return 'text-green-600';
    if (points < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreIcon = (points) => {
    if (points > 0) return '✅';
    if (points < 0) return '❌';
    return 'ℹ️';
  };

  const getConsequenceIcon = (type) => {
    switch (type) {
      case 'positive': return '✅';
      case 'negative': return '⚠️';
      case 'neutral': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getConsequenceColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-700 bg-green-50 border-green-200';
      case 'negative': return 'text-red-700 bg-red-50 border-red-200';
      case 'neutral': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`decision-feedback bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Decision Summary */}
      <div className="decision-summary mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Decision Made</h2>
        
        <div className="chosen-option p-4 bg-gray-50 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">You chose:</h3>
          <p className="text-gray-700 font-medium">{option.text}</p>
          {option.description && (
            <p className="text-gray-600 text-sm mt-1">{option.description}</p>
          )}
        </div>

        {/* Score Display */}
        <div className={`score-display flex items-center p-4 rounded-lg border-2 ${
          evaluation.points > 0 ? 'bg-green-50 border-green-200' :
          evaluation.points < 0 ? 'bg-red-50 border-red-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <span className="text-2xl mr-3">{getScoreIcon(evaluation.points)}</span>
          <div>
            <div className={`font-bold text-lg ${getScoreColor(evaluation.points)}`}>
              {evaluation.points > 0 ? '+' : ''}{evaluation.points} points
            </div>
            {evaluation.isOptimal && (
              <div className="text-green-600 text-sm font-medium">
                🎯 Optimal decision!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {evaluation.feedback && (
        <div className="feedback mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-semibold text-blue-800 mb-2">Feedback</h3>
          <p className="text-blue-700">{evaluation.feedback}</p>
        </div>
      )}

      {/* Consequences */}
      {showConsequences && visibleConsequences.length > 0 && (
        <div className="consequences mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Consequences</h3>
          <div className="space-y-3">
            {visibleConsequences.map((consequence, index) => (
              <div
                key={index}
                className={`consequence-item p-4 rounded-lg border animate-fade-in ${getConsequenceColor(consequence.type)}`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3 mt-0.5">
                    {getConsequenceIcon(consequence.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{consequence.description}</p>
                    {consequence.impact && (
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          consequence.impact === 'high' ? 'bg-red-100 text-red-700' :
                          consequence.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {consequence.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {evaluation.nextDecisionId ? 'Continue to next decision' : 'Scenario complete'}
        </div>
        
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {autoAdvanceTimer ? (
            <span>Continue ({autoAdvanceTimer}s)</span>
          ) : (
            <span>
              {evaluation.nextDecisionId ? 'Continue' : 'Complete'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

DecisionFeedback.propTypes = {
  evaluation: PropTypes.shape({
    points: PropTypes.number.isRequired,
    feedback: PropTypes.string,
    nextDecisionId: PropTypes.string,
    consequences: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['positive', 'negative', 'neutral']),
      description: PropTypes.string.isRequired,
      impact: PropTypes.oneOf(['low', 'medium', 'high']),
      delay: PropTypes.number
    })),
    isOptimal: PropTypes.bool
  }).isRequired,
  option: PropTypes.shape({
    text: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onContinue: PropTypes.func.isRequired,
  showConsequences: PropTypes.bool,
  autoAdvanceDelay: PropTypes.number,
  className: PropTypes.string
};

export default DecisionFeedback;