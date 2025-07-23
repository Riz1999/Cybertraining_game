import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../ui';

/**
 * Complaint Categorization Interface component for training officers to categorize cybercrimes
 * @param {Object} props - Component props
 * @param {Array} props.scenarios - Array of complaint scenarios to categorize
 * @param {Function} props.onComplete - Function called when categorization is completed
 * @param {Function} props.onProgress - Function called when progress is made
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Complaint Categorization Interface component
 */
const ComplaintCategorizationInterface = ({ 
  scenarios = [], 
  onComplete, 
  onProgress, 
  className = '' 
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [results, setResults] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentScenario = scenarios[currentScenarioIndex];

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Submit categorization
  const handleSubmit = () => {
    if (!selectedCategory || !currentScenario) return;

    const isCorrect = selectedCategory.id === currentScenario.correctCategory;
    const newResult = {
      scenarioId: currentScenario.id,
      selectedCategory: selectedCategory.id,
      correctCategory: currentScenario.correctCategory,
      isCorrect,
      points: isCorrect ? currentScenario.points : 0
    };

    const newResults = [...results, newResult];
    setResults(newResults);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + currentScenario.points);
    }

    // Report progress
    if (onProgress) {
      onProgress({
        currentScenario: currentScenarioIndex + 1,
        totalScenarios: scenarios.length,
        score: score + (isCorrect ? currentScenario.points : 0),
        accuracy: ((newResults.filter(r => r.isCorrect).length / newResults.length) * 100).toFixed(1)
      });
    }
  };

  // Move to next scenario
  const handleNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedCategory(null);
      setShowFeedback(false);
    } else {
      // Complete the exercise
      setIsCompleted(true);
      if (onComplete) {
        onComplete({
          results,
          totalScore: score,
          accuracy: (results.filter(r => r.isCorrect).length / results.length) * 100,
          completedAt: new Date()
        });
      }
    }
  };

  // Reset exercise
  const handleReset = () => {
    setCurrentScenarioIndex(0);
    setSelectedCategory(null);
    setResults([]);
    setShowFeedback(false);
    setIsCompleted(false);
    setScore(0);
  };

  if (scenarios.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <p className="text-gray-600">No categorization scenarios available</p>
        </div>
      </Card>
    );
  }

  if (isCompleted) {
    const accuracy = (results.filter(r => r.isCorrect).length / results.length) * 100;
    
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Categorization Complete!</h3>
            <p className="text-gray-600">You have completed all complaint categorization scenarios.</p>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-800">Total Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-green-800">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{results.filter(r => r.isCorrect).length}/{results.length}</div>
              <div className="text-sm text-purple-800">Correct</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Detailed Results:</h4>
            <div className="space-y-2">
              {results.map((result, index) => {
                const scenario = scenarios.find(s => s.id === result.scenarioId);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Scenario {index + 1}: {scenario?.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.isCorrect ? 'success' : 'error'}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {result.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleReset} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Progress Header */}
      <Card className="mb-6">
        <div className="p-4 bg-police-blue text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Complaint Categorization Training</h3>
            <div className="text-sm">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {currentScenarioIndex + 1}/{scenarios.length}</span>
            <span>Score: {score} points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-police-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Current Scenario */}
      {currentScenario && (
        <Card>
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{currentScenario.title}</h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-900 leading-relaxed">{currentScenario.description}</p>
              </div>
              
              {/* Additional Context */}
              {currentScenario.context && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Additional Context:</strong> {currentScenario.context}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-4">Select the most appropriate category:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentScenario.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    disabled={showFeedback}
                    className={`p-4 text-left border-2 rounded-lg transition-all ${
                      selectedCategory?.id === category.id
                        ? 'border-police-blue bg-police-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                    {category.examples && (
                      <div className="text-xs text-gray-500 mt-2">
                        Examples: {category.examples.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            {showFeedback && (
              <div className={`mb-6 p-4 rounded-lg ${
                selectedCategory?.id === currentScenario.correctCategory
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {selectedCategory?.id === currentScenario.correctCategory ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h6 className={`font-medium ${
                      selectedCategory?.id === currentScenario.correctCategory
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}>
                      {selectedCategory?.id === currentScenario.correctCategory ? 'Correct!' : 'Incorrect'}
                    </h6>
                    <p className={`text-sm mt-1 ${
                      selectedCategory?.id === currentScenario.correctCategory
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {currentScenario.explanation}
                    </p>
                    {selectedCategory?.id !== currentScenario.correctCategory && (
                      <p className="text-sm text-red-700 mt-2">
                        <strong>Correct answer:</strong> {
                          currentScenario.categories.find(c => c.id === currentScenario.correctCategory)?.name
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="text-sm text-gray-500">
                Points available: {currentScenario.points}
              </div>
              <div className="space-x-3">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedCategory}
                    variant="primary"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="primary">
                    {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Exercise'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ComplaintCategorizationInterface;