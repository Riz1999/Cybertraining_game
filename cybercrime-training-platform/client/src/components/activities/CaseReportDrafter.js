import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CaseReportDrafter = ({ reportTemplate, instructions, onComplete, disabled = false }) => {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState({});

  // Initialize selections
  useEffect(() => {
    if (reportTemplate && reportTemplate.sections) {
      const initialSelections = {};
      
      reportTemplate.sections.forEach(section => {
        if (section.blanks) {
          Object.keys(section.blanks).forEach(blankKey => {
            initialSelections[`${section.id}-${blankKey}`] = '';
          });
        }
      });
      
      setSelections(initialSelections);
    }
  }, [reportTemplate]);

  const handleSelectionChange = (sectionId, blankKey, value) => {
    if (disabled || submitted) return;
    
    const selectionKey = `${sectionId}-${blankKey}`;
    setSelections(prev => ({
      ...prev,
      [selectionKey]: value
    }));
  };

  const handleSubmit = () => {
    if (disabled || submitted) return;

    // Calculate score and generate feedback
    let correctCount = 0;
    let totalBlanks = 0;
    const newFeedback = {};

    reportTemplate.sections.forEach(section => {
      if (section.blanks) {
        Object.keys(section.blanks).forEach(blankKey => {
          const selectionKey = `${section.id}-${blankKey}`;
          const isCorrect = selections[selectionKey] === section.blanks[blankKey].correctAnswer;
          
          if (isCorrect) {
            correctCount++;
          }
          
          newFeedback[selectionKey] = {
            isCorrect,
            correctAnswer: section.blanks[blankKey].correctAnswer
          };
          
          totalBlanks++;
        });
      }
    });

    const calculatedScore = Math.round((correctCount / totalBlanks) * 25);
    
    setFeedback(newFeedback);
    setScore(calculatedScore);
    setSubmitted(true);

    if (correctCount === totalBlanks) {
      setCompleted(true);
      if (onComplete) {
        onComplete(calculatedScore);
      }
    }
  };

  const handleRetry = () => {
    if (disabled) return;
    
    setSubmitted(false);
    setFeedback({});
  };

  const handleComplete = () => {
    if (disabled) return;
    
    setCompleted(true);
    if (onComplete) {
      onComplete(score);
    }
  };

  // Replace blanks in content with dropdown selectors
  const renderSectionContent = (section) => {
    if (!section.blanks) {
      return <p className="text-gray-700">{section.content}</p>;
    }

    // Split content by blanks
    const parts = section.content.split(/(\[BLANK\d+\])/g);
    
    return (
      <p className="text-gray-700">
        {parts.map((part, index) => {
          // Check if this part is a blank
          const blankMatch = part.match(/\[BLANK(\d+)\]/);
          
          if (blankMatch) {
            const blankKey = `BLANK${blankMatch[1]}`;
            const selectionKey = `${section.id}-${blankKey}`;
            const options = section.blanks[blankKey].options;
            const isCorrect = submitted && feedback[selectionKey] && feedback[selectionKey].isCorrect;
            const isIncorrect = submitted && feedback[selectionKey] && !feedback[selectionKey].isCorrect;
            
            return (
              <span key={index} className="inline-block mx-1">
                <select
                  value={selections[selectionKey] || ''}
                  onChange={(e) => handleSelectionChange(section.id, blankKey, e.target.value)}
                  disabled={disabled || submitted}
                  className={`border rounded px-2 py-1 text-sm ${
                    isCorrect 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : isIncorrect
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300'
                  }`}
                >
                  <option value="">Select...</option>
                  {options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {submitted && isIncorrect && (
                  <span className="ml-1 text-xs text-red-600">
                    (Correct: {feedback[selectionKey].correctAnswer})
                  </span>
                )}
              </span>
            );
          }
          
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  const allFieldsSelected = () => {
    return Object.values(selections).every(value => value !== '');
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <p className="text-gray-700">{instructions}</p>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-50 border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">{reportTemplate.title}</h3>
        </div>
        
        <div className="p-4">
          {reportTemplate.sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h4 className="font-medium mb-2">{section.title}</h4>
              {renderSectionContent(section)}
            </div>
          ))}
        </div>
      </div>

      {submitted && (
        <div className={`p-4 mb-6 rounded-lg ${
          score === 25 
            ? 'bg-green-50 border border-green-200' 
            : score >= 15
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
        }`}>
          <h4 className={`font-medium mb-1 ${
            score === 25 
              ? 'text-green-800' 
              : score >= 15
                ? 'text-yellow-800'
                : 'text-red-800'
          }`}>
            Report Assessment
          </h4>
          <p className={`${
            score === 25 
              ? 'text-green-700' 
              : score >= 15
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}>
            {score === 25 
              ? 'Excellent! Your case report is complete and accurate.' 
              : score >= 15
                ? 'Good effort! Your case report has some inaccuracies. Review the corrections above.'
                : 'Your case report needs improvement. Review the corrections above and try again.'}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div className="mb-4 sm:mb-0">
          {submitted && (
            <div className="text-lg font-medium">
              Score: {score}/25 ({Math.round((score / 25) * 100)}%)
            </div>
          )}
        </div>
        
        <div className="flex space-x-4">
          {submitted && !completed && (
            <button
              onClick={handleRetry}
              disabled={disabled}
              className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Retry
            </button>
          )}
          
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={disabled || !allFieldsSelected()}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled || !allFieldsSelected() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit Report
            </button>
          ) : !completed ? (
            <button
              onClick={handleComplete}
              disabled={disabled}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Complete Activity
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
              Activity Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CaseReportDrafter.propTypes = {
  reportTemplate: PropTypes.shape({
    title: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        blanks: PropTypes.object
      })
    ).isRequired
  }).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default CaseReportDrafter;