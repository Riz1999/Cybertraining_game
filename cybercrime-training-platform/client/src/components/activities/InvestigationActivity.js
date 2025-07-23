import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * InvestigationActivity Component
 * 
 * This component handles multi-level investigation scenarios with various
 * interactive elements like drag-drop, hotspots, quizzes, and branching dialogs.
 */
const InvestigationActivity = ({ 
  title, 
  description, 
  levels = [],
  onComplete,
  onLevelComplete
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelScores, setLevelScores] = useState({});
  const [levelProgress, setLevelProgress] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Handle level completion
  const handleLevelComplete = (levelIndex, score, maxScore) => {
    const newLevelScores = { ...levelScores, [levelIndex]: score };
    const newLevelProgress = { ...levelProgress, [levelIndex]: 'completed' };
    
    setLevelScores(newLevelScores);
    setLevelProgress(newLevelProgress);
    
    // Calculate total score
    const newTotalScore = Object.values(newLevelScores).reduce((sum, s) => sum + s, 0);
    setTotalScore(newTotalScore);
    
    // Notify parent component
    if (onLevelComplete) {
      onLevelComplete(levelIndex, score, maxScore);
    }
    
    // Check if all levels are complete
    if (levelIndex === levels.length - 1) {
      setIsComplete(true);
      if (onComplete) {
        onComplete({
          completed: true,
          totalScore: newTotalScore,
          maxPossibleScore: levels.reduce((sum, level) => sum + level.content.maxScore, 0),
          levelScores: newLevelScores
        });
      }
    } else {
      // Auto-advance to next level after a delay
      setTimeout(() => {
        setCurrentLevel(levelIndex + 1);
      }, 2000);
    }
  };

  // Navigate between levels
  const navigateToLevel = (levelIndex) => {
    if (levelIndex >= 0 && levelIndex < levels.length) {
      setCurrentLevel(levelIndex);
    }
  };

  // Render level navigation
  const renderLevelNavigation = () => {
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {levels.map((level, index) => {
            const isCompleted = levelProgress[index] === 'completed';
            const isCurrent = index === currentLevel;
            const isAccessible = index === 0 || levelProgress[index - 1] === 'completed';
            
            return (
              <button
                key={index}
                onClick={() => isAccessible && navigateToLevel(index)}
                disabled={!isAccessible}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : isAccessible
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                Level {index + 1}
                {isCompleted && (
                  <span className="ml-2">
                    <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Score display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Investigation Progress</span>
            <span className="text-lg font-bold text-blue-600">
              {totalScore} / {levels.reduce((sum, level) => sum + level.content.maxScore, 0)} points
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(totalScore / levels.reduce((sum, level) => sum + level.content.maxScore, 0)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  if (levels.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-600">No investigation levels available.</p>
      </Card>
    );
  }

  const currentLevelData = levels[currentLevel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-blue-100">{description}</p>
        </div>
      </Card>

      {/* Level Navigation */}
      {renderLevelNavigation()}

      {/* Current Level Content */}
      <InvestigationLevel
        level={currentLevelData}
        levelIndex={currentLevel}
        onComplete={(score) => handleLevelComplete(currentLevel, score, currentLevelData.content.maxScore)}
      />

      {/* Completion Screen */}
      {isComplete && (
        <Card className="bg-green-50 border-green-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Investigation Complete!</h3>
            <p className="text-green-700 mb-4">
              You have successfully completed all levels of the advanced cybercrime investigation.
            </p>
            <div className="text-2xl font-bold text-green-800 mb-4">
              Final Score: {totalScore} / {levels.reduce((sum, level) => sum + level.content.maxScore, 0)}
            </div>
            <Badge variant="success" className="text-lg px-6 py-2">
              Master Investigator
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Individual Investigation Level Component
 */
const InvestigationLevel = ({ level, levelIndex, onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskScores, setTaskScores] = useState({});
  const [levelScore, setLevelScore] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const { content } = level;
  const { scenario, tasks, interactiveElements } = content;

  // Handle task completion
  const handleTaskComplete = (taskIndex, score) => {
    const newTaskScores = { ...taskScores, [taskIndex]: score };
    setTaskScores(newTaskScores);
    
    const newLevelScore = Object.values(newTaskScores).reduce((sum, s) => sum + s, 0);
    setLevelScore(newLevelScore);
    
    // Check if all tasks are complete
    if (Object.keys(newTaskScores).length === tasks.length) {
      setIsLevelComplete(true);
      setTimeout(() => {
        onComplete(newLevelScore);
      }, 1500);
    } else {
      // Move to next task
      setCurrentTask(taskIndex + 1);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Level Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{level.title}</h3>
            <p className="text-gray-600 mt-1">{level.description}</p>
          </div>
          <Badge variant="primary">
            Level {levelIndex + 1}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Scenario Description */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{scenario.title}</h4>
          <p className="text-gray-700 mb-4">{scenario.description}</p>
          
          {/* Scenario Details */}
          {scenario.victimDetails && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-800 mb-2">Victim Information</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {scenario.victimDetails.name}</div>
                <div><strong>Age:</strong> {scenario.victimDetails.age}</div>
                <div><strong>Occupation:</strong> {scenario.victimDetails.occupation}</div>
                <div><strong>Location:</strong> {scenario.victimDetails.location}</div>
                <div><strong>Contact:</strong> {scenario.victimDetails.contactNumber}</div>
                <div><strong>Email:</strong> {scenario.victimDetails.email}</div>
              </div>
            </div>
          )}

          {scenario.incidentDetails && (
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-red-800 mb-2">Incident Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Date:</strong> {scenario.incidentDetails.dateOfIncident}</div>
                <div><strong>Time:</strong> {scenario.incidentDetails.timeOfIncident}</div>
                <div><strong>Amount Lost:</strong> ₹{scenario.incidentDetails.amountLost?.toLocaleString()}</div>
                <div><strong>Method:</strong> {scenario.incidentDetails.fraudMethod}</div>
                <div><strong>Bank:</strong> {scenario.incidentDetails.bankName}</div>
                <div><strong>Account:</strong> {scenario.incidentDetails.accountNumber}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Progress */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Investigation Tasks</h4>
          <div className="space-y-2">
            {tasks.map((task, index) => {
              const isCompleted = taskScores.hasOwnProperty(index);
              const isCurrent = index === currentTask && !isLevelComplete;
              
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50'
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`font-medium ${isCurrent ? 'text-blue-800' : isCompleted ? 'text-green-800' : 'text-gray-600'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCompleted && (
                      <span className="text-sm font-medium text-green-600">
                        +{taskScores[index]} pts
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {task.points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Elements */}
        {!isLevelComplete && currentTask < tasks.length && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              {tasks[currentTask].title}
            </h4>
            <InteractiveElement
              element={interactiveElements[currentTask]}
              onComplete={(score) => handleTaskComplete(currentTask, score)}
              maxScore={tasks[currentTask].points}
            />
          </div>
        )}

        {/* Level Completion */}
        {isLevelComplete && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Level Complete!</h3>
            <p className="text-green-700 mb-2">{content.learningOutcome}</p>
            <div className="text-lg font-bold text-green-800">
              Score: {levelScore} / {content.maxScore}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Interactive Element Component
 * Handles different types of interactive elements
 */
const InteractiveElement = ({ element, onComplete, maxScore }) => {
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!element) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Interactive element not available</p>
        <Button onClick={() => onComplete(maxScore)} className="mt-4">
          Continue
        </Button>
      </div>
    );
  }

  const handleComplete = (earnedScore) => {
    setScore(earnedScore);
    setIsComplete(true);
    setTimeout(() => {
      onComplete(earnedScore);
    }, 1500);
  };

  // Render different types of interactive elements
  switch (element.type) {
    case 'drag-drop':
      return <DragDropElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'hotspot-identification':
      return <HotspotElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'fill-in-blanks':
      return <FillInBlanksElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'tool-selection':
      return <ToolSelectionElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'transaction-map':
      return <TransactionMapElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'quiz':
      return <QuizElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'evidence-legal-mapping':
      return <EvidenceLegalMappingElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'admissibility-quiz':
      return <AdmissibilityQuizElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'branching-dialog':
      return <BranchingDialogElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    case 'procedure-matching':
      return <ProcedureMatchingElement element={element} onComplete={handleComplete} maxScore={maxScore} />;
    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Interactive element type "{element.type}" not implemented</p>
          <Button onClick={() => handleComplete(maxScore)} className="mt-4">
            Continue
          </Button>
        </div>
      );
  }
};

// Placeholder components for different interactive elements
// These would be implemented as separate components

const DragDropElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Drag-and-drop interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const HotspotElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Hotspot identification interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const FillInBlanksElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Fill-in-the-blanks interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const ToolSelectionElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Tool selection interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const TransactionMapElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Interactive transaction map would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const QuizElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Quiz interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const EvidenceLegalMappingElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Evidence-legal mapping interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const AdmissibilityQuizElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Evidence admissibility quiz would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const BranchingDialogElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Branching dialog interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

const ProcedureMatchingElement = ({ element, onComplete, maxScore }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="font-medium mb-4">{element.title}</h4>
      <p className="text-gray-600 mb-4">{element.description}</p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Procedure matching interface would be implemented here</p>
        <Button onClick={() => onComplete(maxScore)}>Complete Task</Button>
      </div>
    </div>
  );
};

InvestigationActivity.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  levels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      content: PropTypes.shape({
        type: PropTypes.string.isRequired,
        level: PropTypes.number.isRequired,
        scenario: PropTypes.object.isRequired,
        tasks: PropTypes.array.isRequired,
        interactiveElements: PropTypes.array.isRequired,
        learningOutcome: PropTypes.string.isRequired,
        maxScore: PropTypes.number.isRequired
      }).isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func,
  onLevelComplete: PropTypes.func
};

export default InvestigationActivity;