import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * FillInBlanksActivity Component
 * 
 * A component that allows users to fill in blanks in legal notice templates
 * for cybercrime investigation scenarios.
 */
const FillInBlanksActivity = ({ templates, onComplete, disabled }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({});
  const [activeTemplate, setActiveTemplate] = useState(templates[0]?.id || '');

  // Initialize answers state
  useEffect(() => {
    const initialAnswers = {};
    if (templates && templates.length > 0) {
      templates.forEach(template => {
        if (template && template.blanks) {
          const templateAnswers = {};
          template.blanks.forEach(blank => {
            if (blank && blank.id) {
              templateAnswers[blank.id] = '';
            }
          });
          initialAnswers[template.id] = templateAnswers;
        }
      });
    }
    setAnswers(initialAnswers);
  }, [templates]);

  // Handle answer change
  const handleAnswerChange = (templateId, blankId, value) => {
    if (submitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [blankId]: value
      }
    }));
  };

  // Handle submission
  const handleSubmit = () => {
    let totalCorrect = 0;
    let totalBlanks = 0;
    const newFeedback = {};

    // Calculate score and generate feedback
    templates.forEach(template => {
      const templateFeedback = {};
      let templateCorrect = 0;
      
      template.blanks.forEach(blank => {
        // Make sure answers[template.id] exists and has the blank.id property
        const userAnswer = answers[template.id] && answers[template.id][blank.id] 
          ? answers[template.id][blank.id].trim() 
          : '';
        const isCorrect = userAnswer.toLowerCase() === blank.correctAnswer.toLowerCase();
        
        templateFeedback[blank.id] = {
          isCorrect,
          correctAnswer: blank.correctAnswer,
          hint: blank.hint
        };
        
        if (isCorrect) {
          templateCorrect++;
        }
        
        totalBlanks++;
      });
      
      totalCorrect += templateCorrect;
      newFeedback[template.id] = {
        score: templateCorrect,
        total: template.blanks.length,
        blanks: templateFeedback
      };
    });

    // Normalize score to be out of 10
    const normalizedScore = Math.round((totalCorrect / totalBlanks) * 10);
    
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
    const initialAnswers = {};
    if (templates && templates.length > 0) {
      templates.forEach(template => {
        if (template && template.blanks) {
          const templateAnswers = {};
          template.blanks.forEach(blank => {
            if (blank && blank.id) {
              templateAnswers[blank.id] = '';
            }
          });
          initialAnswers[template.id] = templateAnswers;
        }
      });
    }
    setAnswers(initialAnswers);
    setFeedback({});
    setSubmitted(false);
    setScore(0);
  };

  // Render the template text with input fields for blanks
  const renderTemplateWithBlanks = (template) => {
    const parts = template.text.split(/(\[BLANK-\d+\])/g);
    
    return parts.map((part, index) => {
      const blankMatch = part.match(/\[BLANK-(\d+)\]/);
      
      if (blankMatch) {
        const blankNumber = blankMatch[1];
        const blankId = `blank${blankNumber}`;
        const blank = template.blanks.find(b => b.id === blankId);
        
        if (!blank) return <span key={index}>{part}</span>;
        
        const isCorrect = submitted && feedback[template.id]?.blanks[blankId]?.isCorrect;
        const isIncorrect = submitted && !feedback[template.id]?.blanks[blankId]?.isCorrect;
        
        return (
          <span key={index} className="inline-block mx-1">
            <input
              type="text"
              value={(answers[template.id] && answers[template.id][blankId]) || ''}
              onChange={(e) => handleAnswerChange(template.id, blankId, e.target.value)}
              disabled={disabled || submitted}
              className={`border-b-2 px-2 py-1 text-center min-w-[120px] focus:outline-none focus:border-blue-500 ${
                isCorrect 
                  ? 'border-green-500 bg-green-50 text-green-800' 
                  : isIncorrect 
                    ? 'border-red-500 bg-red-50 text-red-800' 
                    : 'border-gray-300'
              }`}
              placeholder={`Blank ${blankNumber}`}
            />
            {submitted && (
              <div className="relative">
                {isIncorrect && (
                  <div className="absolute top-1 left-0 w-full">
                    <div className="bg-white border border-red-200 shadow-lg rounded-md p-2 text-sm text-red-800 z-10">
                      <p className="font-medium">Correct answer: {feedback[template.id].blanks[blankId].correctAnswer}</p>
                      <p className="text-xs mt-1">{feedback[template.id].blanks[blankId].hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </span>
        );
      }
      
      return <span key={index}>{part.replace(/\\n/g, '\n')}</span>;
    });
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
        <p className="text-blue-700">
          Complete the legal notice templates by filling in the blanks with the correct information.
          Pay attention to the context and ensure your answers are precise.
        </p>
      </div>

      {/* Template Selection Tabs (if multiple templates) */}
      {templates.length > 1 && (
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {templates.map(template => (
              <button
                key={template.id}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTemplate === template.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTemplate(template.id)}
              >
                {template.title}
                {submitted && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    feedback[template.id].score === feedback[template.id].total
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {feedback[template.id].score}/{feedback[template.id].total}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Active Template */}
      {templates.map(template => (
        <div 
          key={template.id} 
          className={activeTemplate === template.id ? 'block' : 'hidden'}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{template.title}</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
                {renderTemplateWithBlanks(template)}
              </div>
              
              {/* Template Feedback */}
              {submitted && (
                <div className={`mt-6 p-4 rounded-lg ${
                  feedback[template.id].score === feedback[template.id].total
                    ? 'bg-green-50 border border-green-200'
                    : feedback[template.id].score > feedback[template.id].total / 2
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-red-50 border border-red-200'
                }`}>
                  <h4 className="font-medium mb-2">
                    Score: {feedback[template.id].score}/{feedback[template.id].total}
                  </h4>
                  
                  <p>
                    {feedback[template.id].score === feedback[template.id].total
                      ? 'Perfect! You completed the notice correctly.'
                      : feedback[template.id].score > feedback[template.id].total / 2
                        ? 'Good effort! Review the highlighted fields for improvement.'
                        : 'Review needed. Check the correct answers for the highlighted fields.'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
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
              ? " You've demonstrated a strong understanding of legal notice requirements."
              : score >= 5 
                ? " You've shown some understanding of legal notices, but should review the key details."
                : " Please review the legal notice requirements and try again."}
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
            disabled={disabled || Object.values(answers).some(templateAnswers => 
              Object.values(templateAnswers).some(answer => !answer.trim())
            )}
          >
            Submit Answers
          </Button>
        )}
      </div>
    </div>
  );
};

FillInBlanksActivity.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      blanks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          correctAnswer: PropTypes.string.isRequired,
          hint: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

FillInBlanksActivity.defaultProps = {
  disabled: false
};

export default FillInBlanksActivity;