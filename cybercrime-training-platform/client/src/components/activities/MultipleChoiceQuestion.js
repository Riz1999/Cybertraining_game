import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MultipleChoiceQuestion = ({ question, options, onComplete, disabled = false }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Debug logging
  console.log("MultipleChoiceQuestion props:", { question, options, disabled });
  console.log("MultipleChoiceQuestion state:", { selectedOption, showFeedback, isCorrect, submitted });

  const handleOptionSelect = (optionId) => {
    console.log("Option selected:", optionId, "disabled:", disabled, "submitted:", submitted);
    if (disabled || submitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || disabled || submitted) return;

    const selected = options.find(option => option.id === selectedOption);
    const correct = selected?.correct || false;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setSubmitted(true);
    
    // Calculate score (10 points for correct answer, 0 for incorrect)
    const score = correct ? 10 : 0;
    
    // Notify parent component
    if (onComplete) {
      onComplete(score);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <div 
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            } ${
              showFeedback && option.id === selectedOption
                ? option.correct 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : ''
            } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 mr-3 ${
                selectedOption === option.id 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-800">{option.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showFeedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium mb-2">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p>
            {options.find(option => option.id === selectedOption)?.explanation || 
              (isCorrect 
                ? 'Good job! You selected the correct answer.' 
                : 'Please review the correct answer and explanation.')}
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            !selectedOption || disabled || submitted
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleSubmit}
          disabled={!selectedOption || disabled || submitted}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

MultipleChoiceQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      correct: PropTypes.bool,
      explanation: PropTypes.string
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default MultipleChoiceQuestion;