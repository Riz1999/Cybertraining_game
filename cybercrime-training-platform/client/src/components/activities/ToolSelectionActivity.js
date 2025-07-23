import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * ToolSelectionActivity Component
 * 
 * A component that allows users to select appropriate tools for different evidence items
 * in a cybercrime investigation scenario.
 */
const ToolSelectionActivity = ({ evidenceItems, onComplete, disabled }) => {
  const [selections, setSelections] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize selections state
  useEffect(() => {
    const initialSelections = {};
    evidenceItems.forEach(item => {
      initialSelections[item.id] = [];
    });
    setSelections(initialSelections);
  }, [evidenceItems]);

  // Handle tool selection/deselection
  const handleToolSelection = (evidenceId, toolId) => {
    if (submitted) return;
    
    setSelections(prev => {
      const currentSelections = [...prev[evidenceId]];
      
      // Toggle selection
      if (currentSelections.includes(toolId)) {
        return {
          ...prev,
          [evidenceId]: currentSelections.filter(id => id !== toolId)
        };
      } else {
        return {
          ...prev,
          [evidenceId]: [...currentSelections, toolId]
        };
      }
    });
  };

  // Handle submission
  const handleSubmit = () => {
    let totalScore = 0;
    let maxScore = 0;
    const newFeedback = {};

    // Calculate score and generate feedback
    evidenceItems.forEach(item => {
      const selectedTools = selections[item.id] || [];
      const correctTools = item.tools.filter(tool => tool.correct).map(tool => tool.id);
      const incorrectTools = item.tools.filter(tool => !tool.correct).map(tool => tool.id);
      
      // Count correct selections
      const correctSelections = selectedTools.filter(toolId => correctTools.includes(toolId));
      // Count incorrect selections
      const incorrectSelections = selectedTools.filter(toolId => incorrectTools.includes(toolId));
      
      // Calculate item score
      const itemMaxScore = correctTools.length;
      const itemScore = Math.max(0, correctSelections.length - incorrectSelections.length);
      
      totalScore += itemScore;
      maxScore += itemMaxScore;
      
      // Generate feedback
      newFeedback[item.id] = {
        score: itemScore,
        maxScore: itemMaxScore,
        correctSelections,
        incorrectSelections,
        missedCorrect: correctTools.filter(toolId => !selectedTools.includes(toolId))
      };
    });

    // Normalize score to be out of 10
    const normalizedScore = Math.round((totalScore / maxScore) * 10);
    
    setScore(normalizedScore);
    setFeedback(newFeedback);
    setSubmitted(true);
    
    // Call onComplete with the score
    if (onComplete) {
      onComplete(normalizedScore);
    }
  };

  // Reset the activity
  const handleReset = () => {
    const initialSelections = {};
    evidenceItems.forEach(item => {
      initialSelections[item.id] = [];
    });
    setSelections(initialSelections);
    setFeedback({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
        <p className="text-blue-700">
          For each evidence item, select all the appropriate tools that should be used to properly secure and analyze it.
          Choose carefully, as both correct selections and avoiding incorrect tools are important.
        </p>
      </div>

      {/* Evidence Items */}
      {evidenceItems.map(item => (
        <Card key={item.id} className={submitted ? (feedback[item.id].score === feedback[item.id].maxScore ? 'border-green-300' : 'border-yellow-300') : ''}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-700 mb-4">{item.description}</p>
            
            {/* Tools Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {item.tools.map(tool => {
                const isSelected = selections[item.id]?.includes(tool.id);
                const showFeedback = submitted;
                const isCorrect = tool.correct;
                
                let buttonClass = "p-4 border-2 rounded-lg transition-all duration-200 flex items-center";
                
                if (showFeedback) {
                  if (isSelected && isCorrect) {
                    buttonClass += " bg-green-50 border-green-500 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += " bg-red-50 border-red-500 text-red-800";
                  } else if (!isSelected && isCorrect) {
                    buttonClass += " bg-yellow-50 border-yellow-500 text-yellow-800 opacity-70";
                  } else {
                    buttonClass += " bg-gray-50 border-gray-300 text-gray-500";
                  }
                } else {
                  buttonClass += isSelected 
                    ? " bg-blue-50 border-blue-500 text-blue-800" 
                    : " bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50";
                }
                
                return (
                  <div 
                    key={tool.id} 
                    className={buttonClass}
                    onClick={() => !disabled && handleToolSelection(item.id, tool.id)}
                  >
                    <div className="mr-3">
                      {showFeedback ? (
                        isSelected ? (
                          isCorrect ? (
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          isCorrect ? (
                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          )
                        )
                      ) : (
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tool.name}</h4>
                      {showFeedback && (
                        <p className={`text-sm mt-1 ${
                          isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {tool.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Feedback for this evidence item */}
            {submitted && (
              <div className={`mt-4 p-4 rounded-lg ${
                feedback[item.id].score === feedback[item.id].maxScore
                  ? 'bg-green-50 border border-green-200'
                  : feedback[item.id].score > 0
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className="font-medium mb-2">
                  Score: {feedback[item.id].score}/{feedback[item.id].maxScore}
                </h4>
                
                {feedback[item.id].missedCorrect.length > 0 && (
                  <div className="mb-2">
                    <p className="text-yellow-800 font-medium">You missed these important tools:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {feedback[item.id].missedCorrect.map(toolId => {
                        const tool = item.tools.find(t => t.id === toolId);
                        return (
                          <li key={toolId} className="text-yellow-700">
                            {tool.name} - {tool.explanation}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {feedback[item.id].incorrectSelections.length > 0 && (
                  <div>
                    <p className="text-red-800 font-medium">These tools were not appropriate:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {feedback[item.id].incorrectSelections.map(toolId => {
                        const tool = item.tools.find(t => t.id === toolId);
                        return (
                          <li key={toolId} className="text-red-700">
                            {tool.name} - {tool.explanation}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
      
      {/* Overall Feedback */}
      {submitted && (
        <Alert 
          type={score >= 8 ? "success" : score >= 5 ? "warning" : "error"}
          title={
            score >= 8 
              ? "Excellent work!" 
              : score >= 5 
                ? "Good effort, but room for improvement" 
                : "Review needed"
          }
        >
          <p>
            You scored {score}/10 on this activity. 
            {score >= 8 
              ? " You've demonstrated a strong understanding of proper evidence collection tools and procedures."
              : score >= 5 
                ? " You've shown some understanding of evidence collection, but should review the best practices."
                : " Please review the proper tools and procedures for digital evidence collection."}
          </p>
        </Alert>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        {submitted ? (
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={disabled}
          >
            Try Again
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={disabled || Object.values(selections).every(tools => tools.length === 0)}
          >
            Submit Selections
          </Button>
        )}
      </div>
    </div>
  );
};

ToolSelectionActivity.propTypes = {
  evidenceItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tools: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          correct: PropTypes.bool.isRequired,
          explanation: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

ToolSelectionActivity.defaultProps = {
  disabled: false
};

export default ToolSelectionActivity;