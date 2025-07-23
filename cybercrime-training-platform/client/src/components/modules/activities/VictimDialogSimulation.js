import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../ui';

/**
 * Victim Dialog Simulation Activity
 * Interactive dialog scenarios for practicing victim interviews
 */
const VictimDialogSimulation = ({ activity, onComplete, isCompleted, previousScore }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentDialog, setCurrentDialog] = useState('initial');
  const [responses, setResponses] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [allScenariosComplete, setAllScenariosComplete] = useState(false);

  const scenarios = activity.content.scenarios;

  // Reset state when activity changes
  useEffect(() => {
    if (!isCompleted) {
      setCurrentScenario(0);
      setCurrentDialog('initial');
      setResponses([]);
      setTotalScore(0);
      setScenarioComplete(false);
      setAllScenariosComplete(false);
    }
  }, [activity.id, isCompleted]);

  // Handle dialog option selection
  const handleDialogChoice = (option) => {
    const scenario = scenarios[currentScenario];
    
    // Record the response
    const response = {
      scenarioId: scenario.id,
      dialogId: currentDialog,
      selectedOption: option.id,
      score: option.score,
      timestamp: new Date()
    };
    
    setResponses(prev => [...prev, response]);
    setTotalScore(prev => prev + option.score);

    // Handle next dialog or scenario completion
    if (option.nextDialog) {
      setCurrentDialog(option.nextDialog);
    } else {
      // Scenario completed
      setScenarioComplete(true);
      
      // Check if all scenarios are completed
      if (currentScenario === scenarios.length - 1) {
        setAllScenariosComplete(true);
      }
    }
  };

  // Move to next scenario
  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setCurrentDialog('initial');
      setScenarioComplete(false);
    }
  };

  // Complete the activity
  const handleCompleteActivity = () => {
    const maxPossibleScore = scenarios.length * 20; // Assuming max 20 points per scenario
    const finalScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    onComplete(finalScore, responses);
  };

  // Get current dialog content
  const getCurrentDialogContent = () => {
    const scenario = scenarios[currentScenario];
    
    if (currentDialog === 'initial') {
      return {
        statement: scenario.initialStatement,
        options: scenario.dialogOptions
      };
    }
    
    // Handle follow-up dialogs (simplified for demo)
    const followUpDialogs = {
      'timeline-questions': {
        statement: "Thank you for that information. Can you tell me the exact date and time when you first received the call?",
        options: [
          {
            id: 'detailed-timeline',
            text: "It was on January 15th around 2 PM. The caller said I had won ₹25 lakh in KBC lottery.",
            score: 15,
            feedback: "Good follow-up questioning to establish timeline.",
            nextDialog: null
          }
        ]
      },
      'harassment-details': {
        statement: "I understand this is difficult. Can you tell me what platform they're using to contact you?",
        options: [
          {
            id: 'platform-details',
            text: "They're using WhatsApp and Instagram. They have screenshots of my photos and are demanding ₹50,000.",
            score: 15,
            feedback: "Excellent information gathering while maintaining victim comfort.",
            nextDialog: null
          }
        ]
      },
      'defensive-victim': {
        statement: "I... I thought it was legitimate. They knew some of my details already.",
        options: [
          {
            id: 'recover-rapport',
            text: "I apologize, Mr. Kumar. You're not at fault here. These criminals are very sophisticated. Let's focus on helping you recover your money.",
            score: 10,
            feedback: "Good recovery, but initial approach should have been more empathetic.",
            nextDialog: null
          }
        ]
      },
      'reluctant-victim': {
        statement: "Maybe I shouldn't have come here. This is too embarrassing.",
        options: [
          {
            id: 'rebuild-trust',
            text: "Ms. Sharma, please don't feel that way. You're very brave for reporting this. We're here to help, not judge. Your safety is our priority.",
            score: 8,
            feedback: "Attempting to rebuild trust, but damage from initial response may affect cooperation.",
            nextDialog: null
          }
        ]
      }
    };
    
    return followUpDialogs[currentDialog] || { statement: "Dialog not found", options: [] };
  };

  const currentScenarioData = scenarios[currentScenario];
  const dialogContent = getCurrentDialogContent();

  if (isCompleted) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
            <Badge variant="success">Completed - {previousScore}%</Badge>
          </div>
          <p className="text-gray-600 mb-4">{activity.description}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              You have successfully completed the victim dialog simulation with a score of {previousScore}%.
              You demonstrated good interviewing skills and empathy towards victims.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="info">
              Scenario {currentScenario + 1} of {scenarios.length}
            </Badge>
            <Badge variant="outline">
              Score: {totalScore} pts
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{activity.description}</p>

        {/* Scenario Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">{currentScenarioData.title}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Victim:</span> {currentScenarioData.victimProfile.name}
            </div>
            <div>
              <span className="font-medium">Age:</span> {currentScenarioData.victimProfile.age}
            </div>
            <div>
              <span className="font-medium">Occupation:</span> {currentScenarioData.victimProfile.occupation}
            </div>
            <div>
              <span className="font-medium">Emotional State:</span> {currentScenarioData.victimProfile.emotionalState}
            </div>
          </div>
        </div>

        {/* Dialog Interface */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">V</span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-900">{dialogContent.statement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Options */}
          {!scenarioComplete && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Choose your response:</p>
              {dialogContent.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleDialogChoice(option)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-police-blue rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">O</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{option.text}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Feedback for completed dialog */}
          {scenarioComplete && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Scenario Complete</h5>
              <p className="text-yellow-700">
                You have completed this scenario. Your responses demonstrated your approach to victim interaction.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div>
            {scenarioComplete && !allScenariosComplete && (
              <Button onClick={handleNextScenario} variant="primary">
                Next Scenario
              </Button>
            )}
          </div>
          
          <div>
            {allScenariosComplete && (
              <Button onClick={handleCompleteActivity} variant="success">
                Complete Activity
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {currentScenario + (scenarioComplete ? 1 : 0)} / {scenarios.length} scenarios</span>
            <span>Current Score: {totalScore} points</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-police-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + (scenarioComplete ? 1 : 0)) / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VictimDialogSimulation;