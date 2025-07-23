import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * SequenceActivity Component
 * 
 * A component that allows users to arrange steps in the correct sequence
 * for procedures like evidence chain of custody.
 */
const SequenceActivity = ({ steps, instructions, onComplete, disabled }) => {
  const [sequence, setSequence] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  // Initialize sequence state
  useEffect(() => {
    if (steps && steps.length > 0) {
      // Shuffle steps for initial state
      const shuffledSteps = [...steps].sort(() => Math.random() - 0.5);
      setSequence(shuffledSteps);
    }
  }, [steps]);

  // Handle drag end
  const handleDragEnd = (result) => {
    // Return early if no destination or if submitted
    if (!result || !result.destination || submitted) return;
    
    // Return if source and destination are the same
    if (result.source.index === result.destination.index) return;
    
    try {
      const items = Array.from(sequence);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      setSequence(items);
    } catch (error) {
      console.error("Error in drag and drop:", error);
    }
  };

  // Handle submission
  const handleSubmit = () => {
    try {
      // Check if sequence is valid
      if (!Array.isArray(sequence) || sequence.length === 0) {
        console.error("Cannot submit with empty sequence");
        return;
      }
      
      // Calculate score based on correct positions
      let correctPositions = 0;
      const stepFeedback = sequence.map((step, index) => {
        const isCorrect = step && step.correctPosition === index + 1;
        if (isCorrect) correctPositions++;
        
        return {
          ...step,
          isCorrect,
          correctPosition: step.correctPosition
        };
      });
      
      // Normalize score to be out of 10
      const totalSteps = Array.isArray(steps) ? steps.length : 1;
      const normalizedScore = Math.round((correctPositions / totalSteps) * 10);
      
      setScore(normalizedScore);
      setFeedback(stepFeedback);
      setSubmitted(true);
      
      // Call onComplete with the score
      if (onComplete) {
        onComplete(normalizedScore);
      }
    } catch (error) {
      console.error("Error submitting sequence:", error);
    }
  };

  // Reset the activity
  const handleReset = () => {
    try {
      // Shuffle steps for reset
      if (steps && steps.length > 0) {
        const shuffledSteps = [...steps].sort(() => Math.random() - 0.5);
        setSequence(shuffledSteps);
      }
      setFeedback([]);
      setSubmitted(false);
      setScore(0);
    } catch (error) {
      console.error("Error resetting activity:", error);
    }
  };

  // Check if we have valid steps
  const hasValidSteps = Array.isArray(sequence) && sequence.length > 0;

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
        <p className="text-blue-700">{instructions}</p>
      </div>

      {/* Sequence Steps */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Arrange Steps in Correct Order</h3>
          
          {hasValidSteps ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sequence">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {sequence.map((step, index) => {
                    const showFeedback = submitted && Array.isArray(feedback) && feedback.length > index;
                    const isCorrect = showFeedback && feedback[index] && feedback[index].isCorrect;
                    
                    return (
                      <Draggable 
                        key={step.id} 
                        draggableId={step.id} 
                        index={index}
                        isDragDisabled={disabled || submitted}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg border-2 ${
                              showFeedback
                                ? isCorrect
                                  ? 'bg-green-50 border-green-500'
                                  : 'bg-red-50 border-red-500'
                                : 'bg-white border-gray-300 hover:border-blue-300'
                            } transition-all duration-200 flex items-center`}
                          >
                            <div className="mr-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                showFeedback
                                  ? isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <p className={`font-medium ${
                                showFeedback
                                  ? isCorrect
                                    ? 'text-green-800'
                                    : 'text-red-800'
                                  : 'text-gray-800'
                              }`}>
                                {step.text}
                              </p>
                              
                              {showFeedback && !isCorrect && (
                                <p className="text-sm text-red-700 mt-2">
                                  This step should be at position {step.correctPosition}
                                </p>
                              )}
                            </div>
                            
                            <div className="ml-4">
                              {showFeedback ? (
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
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-700">Loading steps...</p>
            </div>
          )}
          
          {/* Feedback */}
          {submitted && (
            <div className={`mt-6 p-4 rounded-lg ${
              score >= 8 
                ? 'bg-green-50 border border-green-200' 
                : score >= 5 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-red-50 border border-red-200'
            }`}>
              <h4 className="font-medium mb-2">
                Score: {score}/10
              </h4>
              
              <p>
                {score === 10
                  ? 'Perfect! You arranged all steps in the correct order.'
                  : score >= 8
                    ? 'Great job! You have a good understanding of the proper sequence.'
                    : score >= 5
                      ? 'Good effort, but there are some steps out of order.'
                      : 'Review needed. The correct sequence is important for maintaining evidence integrity.'}
              </p>
              
              {score < 10 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">Correct sequence:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    {[...steps]
                      .sort((a, b) => a.correctPosition - b.correctPosition)
                      .map(step => (
                        <li key={step.id} className="text-gray-700">
                          {step.text}
                        </li>
                      ))
                    }
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
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
              ? " You've demonstrated a strong understanding of the proper sequence for evidence chain of custody."
              : score >= 5 
                ? " You've shown some understanding of evidence handling, but should review the correct order of steps."
                : " Please review the proper sequence for maintaining evidence chain of custody."}
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
            disabled={disabled}
          >
            Submit Sequence
          </Button>
        )}
      </div>
    </div>
  );
};

SequenceActivity.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      correctPosition: PropTypes.number.isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

SequenceActivity.defaultProps = {
  disabled: false
};

export default SequenceActivity;