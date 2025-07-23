import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * DocumentationActivity Component
 * 
 * This component displays documentation content with interactive elements
 * for learning about documentation requirements and procedures.
 */
const DocumentationActivity = ({ 
  title, 
  description, 
  sections, 
  attachments = [],
  quizQuestions = [],
  onComplete 
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showAttachments, setShowAttachments] = useState(false);
  
  // Handle section navigation
  const handleNextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    } else if (quizQuestions.length > 0) {
      // If we're at the last section and there's a quiz, show it
      setActiveSection(sections.length);
    } else {
      // Otherwise, complete the activity
      handleComplete();
    }
  };
  
  const handlePrevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };
  
  // Handle quiz answers
  const handleAnswerSelect = (questionId, answerId) => {
    if (quizSubmitted) return;
    
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerId
    });
  };
  
  // Submit quiz
  const handleQuizSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswerId) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
  };
  
  // Complete the activity
  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        completed: true,
        score: quizQuestions.length > 0 ? quizScore : 100,
        timeSpent: 0 // This would ideally track actual time spent
      });
    }
  };
  
  // Render quiz
  const renderQuiz = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Knowledge Check</h3>
        
        {quizQuestions.map((question, index) => (
          <div key={question.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-800 mb-3">{index + 1}. {question.text}</p>
            
            <div className="space-y-2">
              {question.answers.map(answer => (
                <div 
                  key={answer.id}
                  onClick={() => handleAnswerSelect(question.id, answer.id)}
                  className={`p-3 rounded-lg cursor-pointer border ${quizSubmitted ? 
                    answer.id === question.correctAnswerId ? 
                      'bg-green-50 border-green-500' : 
                      quizAnswers[question.id] === answer.id ? 
                        'bg-red-50 border-red-500' : 
                        'border-gray-200' : 
                    quizAnswers[question.id] === answer.id ? 
                      'bg-blue-50 border-blue-500' : 
                      'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center mr-2 ${quizAnswers[question.id] === answer.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                      {quizAnswers[question.id] === answer.id && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700">{answer.text}</span>
                  </div>
                  
                  {quizSubmitted && answer.id === question.correctAnswerId && (
                    <div className="mt-2 text-sm text-green-600">
                      <p><strong>Correct Answer:</strong> {answer.explanation}</p>
                    </div>
                  )}
                  
                  {quizSubmitted && quizAnswers[question.id] === answer.id && answer.id !== question.correctAnswerId && (
                    <div className="mt-2 text-sm text-red-600">
                      <p><strong>Incorrect:</strong> {answer.explanation || 'This is not the correct answer.'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {!quizSubmitted ? (
          <Button 
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
            variant="primary"
            className="mt-4"
          >
            Submit Answers
          </Button>
        ) : (
          <div className="mt-6">
            <div className={`p-4 rounded-lg mb-4 ${quizScore >= 70 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className="font-medium">
                Your score: {quizScore}% {quizScore >= 70 ? '- Well done!' : '- Review the material and try again.'}
              </p>
            </div>
            
            <Button 
              onClick={handleComplete}
              variant="success"
            >
              Complete Activity
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  // Render attachments
  const renderAttachments = () => {
    if (attachments.length === 0) return null;
    
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Reference Materials</h3>
          <button 
            onClick={() => setShowAttachments(!showAttachments)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            {showAttachments ? 'Hide' : 'Show'} Attachments
            <svg className={`ml-1 h-4 w-4 transform ${showAttachments ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {showAttachments && (
          <div className="space-y-3">
            {attachments.map((attachment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{attachment.title}</p>
                  {attachment.description && (
                    <p className="text-sm text-gray-600">{attachment.description}</p>
                  )}
                </div>
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="p-6">
        {/* Section content */}
        {activeSection < sections.length ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{sections[activeSection].title}</h3>
            
            <div className="prose max-w-none">
              {sections[activeSection].content}
            </div>
            
            {sections[activeSection].highlights && (
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Key Points to Remember</h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {sections[activeSection].highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {renderAttachments()}
            
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handlePrevSection}
                disabled={activeSection === 0}
                variant="secondary"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextSection}
                variant="primary"
              >
                {activeSection === sections.length - 1 && quizQuestions.length === 0 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        ) : (
          renderQuiz()
        )}
      </div>
    </Card>
  );
};

DocumentationActivity.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      highlights: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      url: PropTypes.string.isRequired
    })
  ),
  quizQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          explanation: PropTypes.string
        })
      ).isRequired,
      correctAnswerId: PropTypes.string.isRequired
    })
  ),
  onComplete: PropTypes.func
};

export default DocumentationActivity;