import React, { useState } from 'react';
import { Card, Button, Badge } from '../../ui';

/**
 * Simple Victim Dialog System for Module 2
 * @param {Object} props - Component props
 * @param {string} props.scenario - Dialog scenario type
 * @param {Function} props.onComplete - Function called when dialog is completed
 * @param {Function} props.onProgress - Function called when progress is made
 * @returns {React.ReactElement} Victim Dialog System component
 */
const VictimDialogSystem = ({ 
  scenario = 'banking_fraud', 
  onComplete, 
  onProgress 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Dialog steps for banking fraud scenario
  const dialogSteps = [
    {
      id: 'intro',
      victimMessage: 'Officer, thank you for seeing me. Someone has stolen money from my bank account! I lost ₹25,000 and I don\'t know what to do.',
      victimEmotion: 'distressed',
      options: [
        {
          id: 'empathetic',
          text: 'I understand this is very distressing. Please tell me what happened step by step.',
          score: 10,
          feedback: 'Excellent! Showing empathy helps the victim feel comfortable.'
        },
        {
          id: 'procedural',
          text: 'We need to file a complaint. Do you have your bank statements with you?',
          score: 6,
          feedback: 'Good approach, but showing empathy first would be better.'
        },
        {
          id: 'dismissive',
          text: 'How much money are we talking about exactly?',
          score: 2,
          feedback: 'This approach may make the victim feel dismissed. Try being more empathetic.'
        }
      ]
    },
    {
      id: 'details',
      victimMessage: 'I received an email that looked exactly like it was from my bank. It asked me to verify my account details urgently. I clicked the link and entered my information, and the next day ₹25,000 was missing from my account.',
      victimEmotion: 'worried',
      options: [
        {
          id: 'gather_evidence',
          text: 'Can you show me the email you received? We need to gather all the evidence.',
          score: 10,
          feedback: 'Perfect! Gathering evidence is crucial for the investigation.'
        },
        {
          id: 'reassure',
          text: 'Don\'t worry, we will do everything we can to help you recover your money.',
          score: 8,
          feedback: 'Good reassurance, but also remember to gather evidence.'
        },
        {
          id: 'blame',
          text: 'You should have been more careful with suspicious emails.',
          score: 1,
          feedback: 'Avoid blaming the victim. Focus on helping and gathering information.'
        }
      ]
    },
    {
      id: 'information',
      victimMessage: 'Yes, I still have the email. Here it is on my phone. What should I do now? Will I get my money back?',
      victimEmotion: 'hopeful',
      options: [
        {
          id: 'explain_process',
          text: 'Thank you for the evidence. I\'ll explain the complaint process and what steps we\'ll take to investigate this.',
          score: 10,
          feedback: 'Excellent! Clear communication about the process helps build trust.'
        },
        {
          id: 'promise_recovery',
          text: 'Yes, we\'ll definitely get your money back. Don\'t worry about it.',
          score: 4,
          feedback: 'Avoid making promises you cannot guarantee. Be honest about the process.'
        },
        {
          id: 'technical_jargon',
          text: 'This is a classic phishing attack using social engineering techniques to compromise your credentials.',
          score: 5,
          feedback: 'While accurate, use simpler language that the victim can understand.'
        }
      ]
    }
  ];

  const currentDialog = dialogSteps[currentStep];

  // Handle response selection
  const handleResponseSelect = (option) => {
    const newResponse = {
      step: currentStep,
      selectedOption: option.id,
      score: option.score,
      feedback: option.feedback
    };

    setResponses([...responses, newResponse]);
    setScore(score + option.score);

    // Report progress
    if (onProgress) {
      onProgress({
        currentStep: currentStep + 1,
        totalSteps: dialogSteps.length,
        score: score + option.score,
        responses: [...responses, newResponse]
      });
    }

    // Move to next step or complete
    if (currentStep < dialogSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000); // Show feedback for 2 seconds
    } else {
      // Complete the dialog
      setTimeout(() => {
        setIsCompleted(true);
        if (onComplete) {
          onComplete({
            totalScore: score + option.score,
            responses: [...responses, newResponse],
            accuracy: ((score + option.score) / (dialogSteps.length * 10)) * 100,
            completedAt: new Date()
          });
        }
      }, 2000);
    }
  };

  // Reset dialog
  const handleReset = () => {
    setCurrentStep(0);
    setResponses([]);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const accuracy = (score / (dialogSteps.length * 10)) * 100;
    
    return (
      <Card>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interview Complete!</h3>
            <p className="text-gray-600">You have successfully completed the victim interview simulation.</p>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-800">Total Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-green-800">Communication Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{responses.length}</div>
              <div className="text-sm text-purple-800">Responses</div>
            </div>
          </div>

          {/* Performance Feedback */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Performance Feedback:</h4>
            <div className="space-y-2">
              {responses.map((response, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      Step {index + 1}: {response.feedback}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={response.score >= 8 ? 'success' : response.score >= 6 ? 'warning' : 'error'}>
                      {response.score}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleReset} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => onComplete && onComplete({ score, responses, accuracy })} variant="primary">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Progress Header */}
      <Card className="mb-6">
        <div className="p-4 bg-police-blue text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Victim Interview Simulation</h3>
            <div className="text-sm">
              Step {currentStep + 1} of {dialogSteps.length}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {currentStep + 1}/{dialogSteps.length}</span>
            <span>Score: {score} points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-police-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / dialogSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Current Dialog */}
      {currentDialog && (
        <Card>
          <div className="p-6">
            {/* Victim Character */}
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-900">Rajesh Kumar (Victim)</span>
                    <Badge variant="secondary" className="ml-2">
                      {currentDialog.victimEmotion}
                    </Badge>
                  </div>
                  <p className="text-gray-800">{currentDialog.victimMessage}</p>
                </div>
              </div>
            </div>

            {/* Response Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 mb-3">How do you respond?</h4>
              {currentDialog.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleResponseSelect(option)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-police-blue hover:bg-police-blue-50 transition-all"
                >
                  <div className="font-medium text-gray-900">{option.text}</div>
                </button>
              ))}
            </div>

            {/* Show feedback for last response */}
            {responses.length > currentStep && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h6 className="font-medium text-blue-800">Feedback</h6>
                    <p className="text-sm text-blue-700 mt-1">
                      {responses[currentStep]?.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VictimDialogSystem;