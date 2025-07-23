import React, { useState } from 'react';

const ColorFeedbackQuiz = ({ questions, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const handleOptionClick = (questionId, optionId, isCorrect) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: { optionId, isCorrect }
    }));
  };

  const answeredQuestions = Object.keys(selectedAnswers).length;
  const totalQuestions = questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Assessment</h2>
            <p className="text-gray-600">Test your understanding of complaint analysis and cybercrime investigation</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{answeredQuestions}/{totalQuestions}</div>
            <div className="text-sm text-gray-500">Questions Answered</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</div>
      </div>
      
      {questions && questions.length > 0 ? (
        <div className="space-y-8">
          {questions.map((question, index) => {
            const selectedAnswer = selectedAnswers[question.id];
            
            return (
              <div key={question.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Question Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Question {index + 1} of {totalQuestions}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">{question.text}</h3>
                </div>
                
                {/* Answer Options */}
                <div className="p-8">
                  <div className="space-y-4">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer?.optionId === option.id;
                      const isCorrect = option.correct;
                      
                      let buttonClass = "group w-full p-5 text-left border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 ";
                      
                      if (isSelected) {
                        if (isCorrect) {
                          buttonClass += "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-lg shadow-green-100";
                        } else {
                          buttonClass += "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 text-red-800 shadow-lg shadow-red-100";
                        }
                      } else {
                        buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                      }
                      
                      return (
                        <button
                          key={option.id}
                          className={buttonClass}
                          onClick={() => handleOptionClick(question.id, option.id, option.correct)}
                          disabled={selectedAnswer !== undefined}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 ${
                              isSelected 
                                ? (isCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500') 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-lg">{option.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {selectedAnswer && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    selectedAnswer.isCorrect 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      selectedAnswer.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {question.explanation || (selectedAnswer.isCorrect 
                        ? 'Great job! You selected the correct answer.' 
                        : 'That\'s not quite right. Please review the correct answer.')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Quiz Instructions</h4>
            <p className="text-blue-700 mb-4">Click on any answer option to see immediate feedback. Green indicates correct answers, red indicates incorrect answers.</p>
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                if (onComplete) {
                  onComplete(10);
                }
                alert('Quiz completed! You can now proceed to the Summary.');
              }}
            >
              Complete Quiz
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-600">No questions found!</p>
      )}
    </div>
  );
};

export default ColorFeedbackQuiz;