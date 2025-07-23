import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';

const LegalStepsQuiz = ({ questions, instructions, onComplete, disabled = false }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Reset state when new questions are loaded
  useEffect(() => {
    if (disabled) return;
    
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCompleted(false);
    setFeedback('');
  }, [questions, disabled]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerId) => {
    if (disabled || showResults) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle quiz submission
  const handleSubmit = () => {
    if (disabled || showResults) return;
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer) {
        const correctAnswer = question.options.find(option => option.isCorrect);
        if (correctAnswer && selectedAnswer === correctAnswer.id) {
          correctAnswers++;
        }
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / questions.length) * 25);
    setScore(calculatedScore);
    setShowResults(true);
    
    // Check if passed (80% or higher)
    const passThreshold = 0.8;
    const passed = correctAnswers / questions.length >= passThreshold;
    
    if (passed) {
      setCompleted(true);
      setFeedback('Congratulations! You have passed the legal steps quiz.');
      
      // Notify parent component
      if (onComplete) {
        onComplete(calculatedScore);
      }
    } else {
      setFeedback('You need to score at least 80% to pass. Please review the questions and try again.');
    }
  };

  // Handle retry quiz
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setFeedback('');
  };

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium mb-2">Legal Steps Quiz</h3>
      <p className="text-gray-600 mb-6">{instructions}</p>
      
      {feedback && (
        <div className={`p-3 mb-6 text-sm rounded ${
          feedback.includes('Congratulations')
            ? 'bg-green-50 text-green-700'
            : 'bg-yellow-50 text-yellow-700'
        }`}>
          {feedback}
        </div>
      )}
      
      {!showResults ? (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {Object.keys(selectedAnswers).length} of {questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">{currentQuestion.text}</h4>
            
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion.id] === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedAnswers[currentQuestion.id] === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion.id] === option.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || disabled}
            >
              Previous
            </Button>
            
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestion.id] || disabled}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-medium mb-4">Quiz Results</h4>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Your Score</span>
              <span className="text-sm font-medium">{score}/25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  score >= 20 ? 'bg-green-500' : score >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(score / 25) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-6 mb-6">
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id];
              const selectedOption = question.options.find(option => option.id === selectedAnswer);
              const correctOption = question.options.find(option => option.isCorrect);
              const isCorrect = selectedAnswer === correctOption.id;
              
              return (
                <div key={question.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Question {index + 1}</h5>
                      {isCorrect ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className="mt-1">{question.text}</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-2">
                      {question.options.map(option => (
                        <div
                          key={option.id}
                          className={`p-3 rounded-md ${
                            option.isCorrect
                              ? 'bg-green-50 border border-green-200'
                              : option.id === selectedAnswer && !option.isCorrect
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            {option.isCorrect ? (
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : option.id === selectedAnswer && !option.isCorrect ? (
                              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-5 h-5 mr-2"></div>
                            )}
                            <span>{option.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <h6 className="text-sm font-medium text-blue-800 mb-1">Explanation</h6>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {!completed && (
            <Button
              variant="primary"
              onClick={handleRetry}
              disabled={disabled}
            >
              Retry Quiz
            </Button>
          )}
          
          {completed && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Quiz Completed!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>You&apos;ve successfully completed the legal steps quiz.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

LegalStepsQuiz.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          isCorrect: PropTypes.bool.isRequired
        })
      ).isRequired,
      explanation: PropTypes.string
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default LegalStepsQuiz;