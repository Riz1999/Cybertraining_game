/**
 * DecisionTreeContainer Component
 * 
 * This component manages the complete decision tree scenario flow,
 * handling navigation between decision points and tracking progress.
 */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import DecisionPoint from './DecisionPoint';
import DecisionFeedback from './DecisionFeedback';
import DecisionProgress from './DecisionProgress';
import { decisionTreeService } from '../../../simulation/services/DecisionTreeService';

const DecisionTreeContainer = ({
  treeData,
  userId,
  onComplete,
  onError,
  showProgress = true,
  autoAdvanceFeedback = false,
  className = ''
}) => {
  const [currentState, setCurrentState] = useState('loading'); // 'loading', 'decision', 'feedback', 'completed'
  const [currentDecision, setCurrentDecision] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [lastOption, setLastOption] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  // Initialize the decision tree
  useEffect(() => {
    const initializeTree = async () => {
      try {
        setCurrentState('loading');
        const initialProgress = await decisionTreeService.initializeTree(treeData, userId);
        setProgress(initialProgress);
        
        const firstDecision = decisionTreeService.getCurrentDecision();
        if (firstDecision) {
          setCurrentDecision(firstDecision);
          setCurrentState('decision');
        } else {
          throw new Error('No starting decision point found');
        }
      } catch (err) {
        console.error('Error initializing decision tree:', err);
        setError(err.message);
        onError?.(err);
      }
    };

    if (treeData && userId) {
      initializeTree();
    }
  }, [treeData, userId, onError]);

  // Set up event listeners for the decision tree service
  useEffect(() => {
    const handleDecisionMade = (data) => {
      setProgress(data.progress);
    };

    const handleTreeCompleted = (data) => {
      setCurrentState('completed');
      onComplete?.(data);
    };

    decisionTreeService.addEventListener('decisionMade', handleDecisionMade);
    decisionTreeService.addEventListener('treeCompleted', handleTreeCompleted);

    return () => {
      decisionTreeService.removeEventListener('decisionMade', handleDecisionMade);
      decisionTreeService.removeEventListener('treeCompleted', handleTreeCompleted);
    };
  }, [onComplete]);

  const handleDecisionMade = useCallback(async (optionId, metadata = {}) => {
    try {
      if (metadata.isTimeout && !optionId) {
        // Handle timeout case
        setError('Time limit exceeded. Please make a decision more quickly next time.');
        return;
      }

      const result = await decisionTreeService.makeDecision(optionId);
      
      setLastEvaluation(result.evaluation);
      setLastOption(metadata.option || currentDecision.options.find(opt => opt.id === optionId));
      setProgress(result.progress);

      if (result.isCompleted) {
        setCurrentState('completed');
      } else {
        setCurrentState('feedback');
      }
    } catch (err) {
      console.error('Error making decision:', err);
      setError(err.message);
      onError?.(err);
    }
  }, [currentDecision, onError]);

  const handleContinueFromFeedback = useCallback(() => {
    const nextDecision = decisionTreeService.getCurrentDecision();
    
    if (nextDecision) {
      setCurrentDecision(nextDecision);
      setCurrentState('decision');
      setLastEvaluation(null);
      setLastOption(null);
    } else {
      setCurrentState('completed');
    }
  }, []);

  const handleRestart = useCallback(() => {
    decisionTreeService.reset();
    setCurrentState('loading');
    setCurrentDecision(null);
    setLastEvaluation(null);
    setLastOption(null);
    setProgress(null);
    setError(null);
    
    // Re-initialize
    const initializeTree = async () => {
      try {
        const initialProgress = await decisionTreeService.initializeTree(treeData, userId);
        setProgress(initialProgress);
        
        const firstDecision = decisionTreeService.getCurrentDecision();
        if (firstDecision) {
          setCurrentDecision(firstDecision);
          setCurrentState('decision');
        }
      } catch (err) {
        setError(err.message);
        onError?.(err);
      }
    };

    initializeTree();
  }, [treeData, userId, onError]);

  if (error) {
    return (
      <div className={`decision-tree-error bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-3">⚠️</span>
          <h2 className="text-xl font-bold text-red-800">Error</h2>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentState === 'loading') {
    return (
      <div className={`decision-tree-loading flex items-center justify-center p-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading decision scenario...</p>
        </div>
      </div>
    );
  }

  if (currentState === 'completed') {
    const metrics = decisionTreeService.getPerformanceMetrics();
    const decisionPath = decisionTreeService.getDecisionPath();
    const suggestions = decisionTreeService.getImprovementSuggestions();

    return (
      <div className={`decision-tree-completed bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scenario Complete!</h2>
          <p className="text-gray-600">You have completed the decision-based scenario.</p>
        </div>

        {/* Performance Summary */}
        <div className="performance-summary mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalScore}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(metrics.optimalDecisionRate * 100)}%
              </div>
              <div className="text-sm text-gray-600">Optimal Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalDecisions}</div>
              <div className="text-sm text-gray-600">Decisions Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(metrics.timeSpent / 1000)}s
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Decision Path */}
        <div className="decision-path mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Decision Path</h3>
          <div className="space-y-2">
            {decisionPath.map((decision, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded border">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3 ${
                  decision.isOptimal ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{decision.decisionPoint}</div>
                  <div className="text-sm text-gray-600">{decision.option}</div>
                </div>
                <div className={`font-bold ${decision.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {decision.points > 0 ? '+' : ''}{decision.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        {suggestions.length > 0 && (
          <div className="improvement-suggestions mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Suggestions for Improvement</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => onComplete?.(metrics)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`decision-tree-container ${className}`}>
      {/* Progress indicator */}
      {showProgress && progress && (
        <DecisionProgress
          progress={progress}
          tree={decisionTreeService.currentTree}
          className="mb-6"
        />
      )}

      {/* Main content */}
      {currentState === 'decision' && currentDecision && (
        <DecisionPoint
          decisionPoint={currentDecision}
          onDecisionMade={handleDecisionMade}
          timeLimit={currentDecision.timeLimit}
        />
      )}

      {currentState === 'feedback' && lastEvaluation && lastOption && (
        <DecisionFeedback
          evaluation={lastEvaluation}
          option={lastOption}
          onContinue={handleContinueFromFeedback}
          autoAdvanceDelay={autoAdvanceFeedback ? 5 : null}
        />
      )}
    </div>
  );
};

DecisionTreeContainer.propTypes = {
  treeData: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  onError: PropTypes.func,
  showProgress: PropTypes.bool,
  autoAdvanceFeedback: PropTypes.bool,
  className: PropTypes.string
};

export default DecisionTreeContainer;