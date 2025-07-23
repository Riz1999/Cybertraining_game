/**
 * DecisionProgress Component
 * 
 * This component displays the user's progress through a decision tree scenario,
 * showing completed decisions, current score, and overall progress.
 */
import React from 'react';
import PropTypes from 'prop-types';

const DecisionProgress = ({
  progress,
  tree,
  showDetailedHistory = false,
  className = ''
}) => {
  if (!progress || !tree) {
    return null;
  }

  const metrics = progress.getPerformanceMetrics();
  const completionPercentage = tree.decisionPoints.length > 0 
    ? (progress.decisions.length / tree.decisionPoints.length) * 100 
    : 0;

  const getScoreColor = (score) => {
    const percentage = tree.maxScore > 0 ? (score / tree.maxScore) * 100 : 0;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score) => {
    const percentage = tree.maxScore > 0 ? (score / tree.maxScore) * 100 : 0;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`decision-progress bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Progress</h3>
        <div className="text-sm text-gray-600">
          {progress.decisions.length} of {tree.decisionPoints.length} decisions
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Completion</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(progress.totalScore)}`}>
            {progress.totalScore}
          </div>
          <div className="text-xs text-gray-600">Current Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-700">
            {tree.maxScore}
          </div>
          <div className="text-xs text-gray-600">Max Possible</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(metrics.optimalDecisionRate * 100)}%
          </div>
          <div className="text-xs text-gray-600">Optimal Rate</div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Score Progress</span>
          <span>{progress.totalScore} / {tree.maxScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(progress.totalScore)}`}
            style={{ 
              width: `${tree.maxScore > 0 ? (progress.totalScore / tree.maxScore) * 100 : 0}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>Time Elapsed:</span>
        <span>{Math.round(metrics.timeSpent / 1000)}s</span>
      </div>

      {/* Decision History (if enabled) */}
      {showDetailedHistory && progress.decisions.length > 0 && (
        <div className="decision-history">
          <h4 className="font-medium text-gray-800 mb-2">Recent Decisions</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {progress.decisions.slice(-3).map((decision, index) => {
              const decisionPoint = tree.decisionPoints.find(dp => dp.id === decision.decisionId);
              const option = decisionPoint?.options.find(opt => opt.id === decision.optionId);
              
              return (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-2 ${
                    decision.isOptimal ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {decision.isOptimal ? '✓' : '•'}
                  </span>
                  <div className="flex-1 truncate">
                    <div className="font-medium text-gray-800 truncate">
                      {decisionPoint?.title || 'Unknown Decision'}
                    </div>
                    <div className="text-gray-600 truncate">
                      {option?.text || 'Unknown Option'}
                    </div>
                  </div>
                  <div className={`font-bold text-xs ${
                    decision.points > 0 ? 'text-green-600' : 
                    decision.points < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {decision.points > 0 ? '+' : ''}{decision.points}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Optimal Decision Indicator */}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Optimal</span>
          </div>
          
          {/* Sub-optimal Decision Indicator */}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Sub-optimal</span>
          </div>
        </div>

        {/* Completion Status */}
        <div className="text-xs text-gray-600">
          {progress.isCompleted ? (
            <span className="text-green-600 font-medium">✓ Complete</span>
          ) : (
            <span>In Progress</span>
          )}
        </div>
      </div>
    </div>
  );
};

DecisionProgress.propTypes = {
  progress: PropTypes.shape({
    decisions: PropTypes.array.isRequired,
    totalScore: PropTypes.number.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    getPerformanceMetrics: PropTypes.func.isRequired
  }).isRequired,
  tree: PropTypes.shape({
    decisionPoints: PropTypes.array.isRequired,
    maxScore: PropTypes.number.isRequired
  }).isRequired,
  showDetailedHistory: PropTypes.bool,
  className: PropTypes.string
};

export default DecisionProgress;