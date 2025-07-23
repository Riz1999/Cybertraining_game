import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

const QuizComponent = ({ questions, onComplete, disabled = false }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleQuestionComplete = (questionScore) => {
    // Add answer to answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex].id,
      score: questionScore
    };
    setAnswers(newAnswers);
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    } else {
      // Calculate final score
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer.score, 0);
      const maxPossibleScore = questions.length * 10;
      const finalScore = Math.round((totalScore / maxPossibleScore) * 10); // Scale to 10 points
      
      setScore(finalScore);
      setQuizCompleted(true);
      
      // Notify parent component
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="bg-white rounded-lg">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className="text-sm">{Math.round(((currentQuestionIndex) / questions.length) * 100)}% complete</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current question */}
      {!quizCompleted && currentQuestion && (
        <MultipleChoiceQuestion
          question={currentQuestion.text}
          options={currentQuestion.options}
          onComplete={handleQuestionComplete}
          disabled={disabled}
        />
      )}
      
      {/* Quiz completion summary */}
      {quizCompleted && (
        <div className="p-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h3 className="text-xl font-medium text-blue-800 mb-2">Quiz Completed!</h3>
            <p className="text-blue-700 mb-4">
              You scored {score} out of 10 points.
            </p>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Your Score</p>
                <p className="text-sm">{score}/10</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    score >= 8 ? 'bg-green-600' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {score >= 8 ? (
              <p className="text-green-700">Excellent! You have a strong understanding of the material.</p>
            ) : score >= 5 ? (
              <p className="text-yellow-700">Good job! You have a decent understanding, but there&#39;s room for improvement.</p>
            ) : (
              <p className="text-red-700">You might want to review the material again to improve your understanding.</p>
            )}
          </div>
          
          <h3 className="text-lg font-medium mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              const isCorrect = answer && answer.score > 0;
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 border rounded-lg ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <p className="font-medium mb-2">{index + 1}. {question.text}</p>
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-sm rounded ${
                      isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  {question.explanation && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

QuizComponent.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          correct: PropTypes.bool,
          explanation: PropTypes.string
        })
      ).isRequired,
      explanation: PropTypes.string
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default QuizComponent;