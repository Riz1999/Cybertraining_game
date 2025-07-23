import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Interstate Coordination Workflow Component
 * 
 * This component presents a step-by-step workflow for coordinating with police
 * departments across state lines to apprehend suspects.
 */
const InterstateCoordinationWorkflow = ({ workflowData, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { title, description, steps } = workflowData;
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const handleOptionSelect = (optionId) => {
    const selectedOption = currentStep.options.find(option => option.id === optionId);
    
    // Update selected options
    setSelectedOptions({
      ...selectedOptions,
      [currentStep.id]: optionId
    });

    // Show feedback
    setFeedback({
      isCorrect: selectedOption.isCorrect,
      message: selectedOption.feedback
    });

    // Update score if correct
    if (selectedOption.isCorrect) {
      setScore(prevScore => prevScore + 25); // 25 points per correct answer (100 total for 4 steps)
    }

    // Auto-advance after a delay
    setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(prevIndex => prevIndex + 1);
        setFeedback(null);
      } else {
        // Workflow completed
        setCompleted(true);
        if (onComplete) {
          onComplete(score);
        }
      }
    }, 2000);
  };

  const getProgressPercentage = () => {
    return ((currentStepIndex + 1) / totalSteps) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-700">
            Score: {score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {currentStep.title}
          </h3>
          <p className="text-gray-700 mb-6">{currentStep.description}</p>

          <div className="space-y-4">
            {currentStep.options.map((option) => {
              const isSelected = selectedOptions[currentStep.id] === option.id;
              let optionClass = "border border-gray-300 rounded-lg p-4 cursor-pointer transition-all";
              
              if (isSelected && feedback) {
                optionClass += feedback.isCorrect
                  ? " border-green-500 bg-green-50"
                  : " border-red-500 bg-red-50";
              } else {
                optionClass += " hover:border-blue-400 hover:bg-blue-50";
              }

              return (
                <div
                  key={option.id}
                  className={optionClass}
                  onClick={() => !selectedOptions[currentStep.id] && handleOptionSelect(option.id)}
                >
                  <p className="text-gray-800">{option.text}</p>
                  
                  {isSelected && feedback && (
                    <div className={`mt-3 p-2 rounded ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <p className="text-sm">{feedback.message}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-green-800 mb-3">
            Workflow Completed!
          </h3>
          <p className="text-green-700 mb-4">
            You have successfully completed the interstate coordination workflow.
          </p>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-100">
            <span className="font-medium">Final Score:</span>
            <span className="text-xl font-bold">{score}/100</span>
          </div>
          
          {score < 75 && (
            <p className="mt-4 text-amber-700">
              Consider reviewing the correct procedures for interstate coordination to improve your score.
            </p>
          )}
          
          {score >= 75 && (
            <p className="mt-4 text-green-700">
              Great job! You&apos;ve demonstrated a good understanding of interstate coordination procedures.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

InterstateCoordinationWorkflow.propTypes = {
  workflowData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            isCorrect: PropTypes.bool.isRequired,
            feedback: PropTypes.string.isRequired
          })
        ).isRequired
      })
    ).isRequired
  }).isRequired,
  onComplete: PropTypes.func
};

export default InterstateCoordinationWorkflow;