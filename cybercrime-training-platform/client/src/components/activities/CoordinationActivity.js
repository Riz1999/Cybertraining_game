import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * CoordinationActivity component
 * 
 * This component handles multi-bank coordination scenarios where users need to
 * coordinate with multiple financial institutions for complex fraud cases.
 */
const CoordinationActivity = ({ onComplete, onProgress }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock coordination scenario data
  const coordinationScenario = {
    title: "Multi-Bank Coordination for Complex Fraud Case",
    description: "A sophisticated fraud case involves transactions across multiple banks. You need to coordinate with different financial institutions to freeze accounts and gather evidence.",

    case: {
      id: "CASE-2024-001",
      amount: "₹2,50,000",
      banks: ["State Bank of India", "HDFC Bank", "ICICI Bank"],
      timeframe: "Last 48 hours",
      suspectAccounts: 3,
      victimAccounts: 2
    },

    steps: [
      {
        id: "step1",
        title: "Initial Assessment",
        description: "You've received a complex fraud complaint involving multiple banks. What's your first priority?",
        options: [
          {
            id: "option1",
            text: "Contact all banks simultaneously to freeze all accounts",
            isCorrect: false,
            feedback: "While urgent, you need to prioritize based on transaction flow and amounts involved."
          },
          {
            id: "option2",
            text: "Analyze the transaction flow to identify the primary receiving bank",
            isCorrect: true,
            feedback: "Correct! Understanding the money trail helps prioritize which bank to contact first."
          },
          {
            id: "option3",
            text: "Wait for more complaints to establish a pattern",
            isCorrect: false,
            feedback: "Time is critical in fraud cases. Waiting could result in funds being withdrawn."
          }
        ]
      },
      {
        id: "step2",
        title: "Bank Prioritization",
        description: "Analysis shows ₹1,80,000 went to HDFC Bank, ₹50,000 to ICICI Bank, and ₹20,000 to SBI. How do you prioritize your coordination efforts?",
        options: [
          {
            id: "option1",
            text: "Contact HDFC Bank first as it has the largest amount",
            isCorrect: true,
            feedback: "Correct! Prioritizing by amount maximizes potential recovery."
          },
          {
            id: "option2",
            text: "Contact all banks in alphabetical order",
            isCorrect: false,
            feedback: "Alphabetical order doesn't consider the urgency or amount involved."
          },
          {
            id: "option3",
            text: "Contact SBI first as it's a government bank",
            isCorrect: false,
            feedback: "Bank ownership type shouldn't determine priority in fraud cases."
          }
        ]
      },
      {
        id: "step3",
        title: "Communication Protocol",
        description: "When contacting HDFC Bank's fraud team, what information should you provide first?",
        options: [
          {
            id: "option1",
            text: "Your personal details and police station information",
            isCorrect: false,
            feedback: "While important, the urgent transaction details should come first."
          },
          {
            id: "option2",
            text: "Account numbers and transaction details for immediate freeze",
            isCorrect: true,
            feedback: "Correct! Providing specific transaction details enables immediate action."
          },
          {
            id: "option3",
            text: "Complete case background and victim statements",
            isCorrect: false,
            feedback: "Detailed background can come later. Immediate freeze requires specific transaction data."
          }
        ]
      },
      {
        id: "step4",
        title: "Documentation Coordination",
        description: "Each bank requires different documentation formats. How do you handle this efficiently?",
        options: [
          {
            id: "option1",
            text: "Create a standardized format and ask all banks to accept it",
            isCorrect: false,
            feedback: "Banks have regulatory requirements and may not accept non-standard formats."
          },
          {
            id: "option2",
            text: "Prepare bank-specific documentation as per their requirements",
            isCorrect: true,
            feedback: "Correct! Adapting to each bank's requirements ensures faster processing."
          },
          {
            id: "option3",
            text: "Send the same FIR copy to all banks",
            isCorrect: false,
            feedback: "FIR alone may not contain all the specific details each bank needs."
          }
        ]
      },
      {
        id: "step5",
        title: "Follow-up Strategy",
        description: "After initial contact with all banks, what's your follow-up strategy?",
        options: [
          {
            id: "option1",
            text: "Wait for banks to respond with updates",
            isCorrect: false,
            feedback: "Passive waiting can delay the process. Active follow-up is necessary."
          },
          {
            id: "option2",
            text: "Set up a coordination group with all bank representatives",
            isCorrect: true,
            feedback: "Correct! A coordination group ensures real-time updates and collaborative action."
          },
          {
            id: "option3",
            text: "Contact each bank individually every few hours",
            isCorrect: false,
            feedback: "Individual contacts can be inefficient and may lead to miscommunication."
          }
        ]
      }
    ]
  };

  // Handle option selection
  const handleOptionSelect = (stepId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [stepId]: optionId
    }));
  };

  // Handle step completion
  const handleStepComplete = () => {
    const currentStepData = coordinationScenario.steps[currentStep];
    const selectedOption = currentStepData.options.find(
      option => option.id === selectedOptions[currentStepData.id]
    );

    if (selectedOption?.isCorrect) {
      setScore(prev => prev + 20);
    }

    if (currentStep < coordinationScenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Activity completed
      setIsCompleted(true);
      const finalScore = selectedOption?.isCorrect ? score + 20 : score;

      if (onComplete) {
        onComplete({
          success: true,
          score: finalScore,
          totalSteps: coordinationScenario.steps.length,
          correctAnswers: Math.floor(finalScore / 20)
        });
      }
    }

    // Update progress
    if (onProgress) {
      onProgress({
        currentStep: currentStep + 1,
        totalSteps: coordinationScenario.steps.length,
        score: selectedOption?.isCorrect ? score + 20 : score
      });
    }
  };

  // Get current step data
  const currentStepData = coordinationScenario.steps[currentStep];
  const selectedOptionId = selectedOptions[currentStepData?.id];
  const selectedOption = currentStepData?.options.find(option => option.id === selectedOptionId);

  if (isCompleted) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coordination Activity Completed!</h2>
            <p className="text-gray-600 mb-4">
              You&apos;ve successfully navigated the multi-bank coordination scenario.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.floor(score / 20)}/{coordinationScenario.steps.length}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.round((score / (coordinationScenario.steps.length * 20)) * 100)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Key Takeaways:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Prioritize banks based on transaction amounts and timing</li>
              <li>Provide specific transaction details for immediate action</li>
              <li>Adapt documentation to each bank&apos;s requirements</li>
              <li>Establish coordination groups for efficient communication</li>
              <li>Follow up actively rather than waiting passively</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Case Overview */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{coordinationScenario.title}</h2>
          <p className="text-gray-600 mb-4">{coordinationScenario.description}</p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Case Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Case ID:</strong> {coordinationScenario.case.id}</p>
                <p><strong>Total Amount:</strong> {coordinationScenario.case.amount}</p>
                <p><strong>Timeframe:</strong> {coordinationScenario.case.timeframe}</p>
              </div>
              <div>
                <p><strong>Banks Involved:</strong> {coordinationScenario.case.banks.join(', ')}</p>
                <p><strong>Suspect Accounts:</strong> {coordinationScenario.case.suspectAccounts}</p>
                <p><strong>Victim Accounts:</strong> {coordinationScenario.case.victimAccounts}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {coordinationScenario.steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / coordinationScenario.steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>

          <div className="space-y-3">
            {currentStepData.options.map((option) => (
              <div key={option.id}>
                <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name={`step-${currentStepData.id}`}
                    value={option.id}
                    checked={selectedOptionId === option.id}
                    onChange={() => handleOptionSelect(currentStepData.id, option.id)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-gray-900">{option.text}</span>
                </label>

                {selectedOptionId === option.id && selectedOption && (
                  <div className={`mt-2 p-3 rounded-md ${option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                    <p className={`text-sm ${option.isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                      {option.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              onClick={handleStepComplete}
              disabled={!selectedOptionId}
            >
              {currentStep < coordinationScenario.steps.length - 1 ? 'Next Step' : 'Complete Activity'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

CoordinationActivity.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onProgress: PropTypes.func
};

export default CoordinationActivity;