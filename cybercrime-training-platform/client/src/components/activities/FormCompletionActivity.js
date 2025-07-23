import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * FormCompletionActivity Component
 * 
 * A component that allows users to complete forms like Section 65B certificates
 * for cybercrime investigation scenarios.
 */
const FormCompletionActivity = ({ formFields, instructions, onComplete, disabled }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({});

  // Initialize answers state
  useEffect(() => {
    const initialAnswers = {};
    formFields.forEach(field => {
      initialAnswers[field.id] = '';
    });
    setAnswers(initialAnswers);
  }, [formFields]);

  // Handle answer change
  const handleAnswerChange = (fieldId, value) => {
    if (submitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Calculate similarity between two strings (0-1)
  const calculateSimilarity = (str1, str2) => {
    // Convert both strings to lowercase for case-insensitive comparison
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Simple exact match
    if (s1 === s2) return 1;
    
    // Check if all keywords from correct answer are in user answer
    const keywords = s2.split(/\s+/).filter(word => word.length > 3);
    if (keywords.length === 0) return 0;
    
    const matchedKeywords = keywords.filter(keyword => s1.includes(keyword));
    return matchedKeywords.length / keywords.length;
  };

  // Handle submission
  const handleSubmit = () => {
    let totalScore = 0;
    const newFeedback = {};

    // Calculate score and generate feedback
    formFields.forEach(field => {
      const userAnswer = answers[field.id].trim();
      const correctAnswer = field.correctAnswer;
      
      // Calculate similarity score (0-1)
      const similarity = calculateSimilarity(userAnswer, correctAnswer);
      
      // Determine if answer is correct, partially correct, or incorrect
      let status = 'incorrect';
      let fieldScore = 0;
      
      if (similarity >= 0.8) {
        status = 'correct';
        fieldScore = 1;
      } else if (similarity >= 0.5) {
        status = 'partial';
        fieldScore = 0.5;
      }
      
      totalScore += fieldScore;
      
      newFeedback[field.id] = {
        status,
        similarity,
        correctAnswer,
        hint: field.hint
      };
    });

    // Normalize score to be out of 10
    const normalizedScore = Math.round((totalScore / formFields.length) * 10);
    
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
    formFields.forEach(field => {
      initialAnswers[field.id] = '';
    });
    setAnswers(initialAnswers);
    setFeedback({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
        <p className="text-blue-700">{instructions}</p>
      </div>

      {/* Form Fields */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-6">Section 65B Certificate</h3>
          
          <div className="space-y-6">
            {formFields.map(field => {
              const fieldFeedback = submitted ? feedback[field.id] : null;
              const fieldStatus = fieldFeedback?.status;
              
              return (
                <div key={field.id} className="space-y-2">
                  <label 
                    htmlFor={field.id} 
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={answers[field.id] || ''}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                      disabled={disabled || submitted}
                      rows={4}
                      className={`w-full p-3 border rounded-md ${
                        fieldStatus === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : fieldStatus === 'partial'
                            ? 'border-yellow-500 bg-yellow-50'
                            : fieldStatus === 'incorrect'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      id={field.id}
                      type="text"
                      value={answers[field.id] || ''}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                      disabled={disabled || submitted}
                      className={`w-full p-3 border rounded-md ${
                        fieldStatus === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : fieldStatus === 'partial'
                            ? 'border-yellow-500 bg-yellow-50'
                            : fieldStatus === 'incorrect'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  
                  {/* Field Feedback */}
                  {submitted && fieldStatus !== 'correct' && (
                    <div className={`mt-2 p-3 rounded-md ${
                      fieldStatus === 'partial'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        fieldStatus === 'partial' ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {fieldStatus === 'partial'
                          ? 'Partially correct. Consider including:'
                          : 'Incorrect. The answer should include:'}
                      </p>
                      <p className="text-sm mt-1">
                        {fieldFeedback.correctAnswer}
                      </p>
                      <p className="text-xs mt-2 text-gray-600">
                        Hint: {fieldFeedback.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Form Feedback */}
          {submitted && (
            <div className={`mt-8 p-4 rounded-lg ${
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
                  ? 'Perfect! Your Section 65B certificate is complete and accurate.'
                  : score >= 8
                    ? 'Great job! Your certificate is mostly accurate with minor improvements needed.'
                    : score >= 5
                      ? 'Good effort, but your certificate needs several improvements to be legally sound.'
                      : 'Review needed. A properly completed Section 65B certificate is essential for electronic evidence admissibility.'}
              </p>
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
              ? " You've demonstrated a strong understanding of Section 65B certificate requirements."
              : score >= 5 
                ? " You've shown some understanding of Section 65B certificates, but should review the key components."
                : " Please review the requirements for Section 65B certificates to ensure electronic evidence admissibility."}
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
            disabled={disabled || Object.values(answers).some(answer => !answer.trim())}
          >
            Submit Form
          </Button>
        )}
      </div>
    </div>
  );
};

FormCompletionActivity.propTypes = {
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea']).isRequired,
      correctAnswer: PropTypes.string.isRequired,
      hint: PropTypes.string.isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

FormCompletionActivity.defaultProps = {
  disabled: false
};

export default FormCompletionActivity;