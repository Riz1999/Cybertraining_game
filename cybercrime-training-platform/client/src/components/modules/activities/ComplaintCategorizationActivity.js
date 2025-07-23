import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../ui';

/**
 * Complaint Categorization Activity
 * Practice categorizing cybercrime complaints into appropriate categories
 */
const ComplaintCategorizationActivity = ({ activity, onComplete, isCompleted, previousScore }) => {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [responses, setResponses] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const { categories, cases } = activity.content;

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Start timer when component mounts (if not completed)
  useEffect(() => {
    if (!isCompleted && !timerActive) {
      setTimerActive(true);
    }
  }, [isCompleted]);

  // Handle time up
  const handleTimeUp = () => {
    // Auto-submit current responses
    const finalScore = calculateScore();
    onComplete(finalScore, responses);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Submit current case
  const handleSubmitCase = () => {
    const currentCaseData = cases[currentCase];
    const isCorrectCategory = selectedCategory === currentCaseData.correctCategory;
    const isCorrectSubcategory = selectedSubcategory === currentCaseData.correctSubcategory;
    
    const response = {
      caseId: currentCaseData.id,
      selectedCategory,
      selectedSubcategory,
      correctCategory: currentCaseData.correctCategory,
      correctSubcategory: currentCaseData.correctSubcategory,
      isCorrect: isCorrectCategory && isCorrectSubcategory,
      difficulty: currentCaseData.difficulty,
      timestamp: new Date()
    };

    setResponses(prev => [...prev, response]);
    setShowFeedback(true);
  };

  // Move to next case
  const handleNextCase = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(prev => prev + 1);
      setSelectedCategory('');
      setSelectedSubcategory('');
      setShowFeedback(false);
    } else {
      // All cases completed
      const finalScore = calculateScore();
      onComplete(finalScore, responses);
    }
  };

  // Calculate score
  const calculateScore = () => {
    if (responses.length === 0) return 0;
    
    let totalPoints = 0;
    let maxPoints = 0;
    
    responses.forEach(response => {
      // Points based on difficulty
      const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
      };
      
      const basePoints = 20;
      const maxCasePoints = basePoints * difficultyMultiplier[response.difficulty];
      maxPoints += maxCasePoints;
      
      if (response.isCorrect) {
        totalPoints += maxCasePoints;
      } else if (response.selectedCategory === response.correctCategory) {
        // Partial credit for correct category but wrong subcategory
        totalPoints += maxCasePoints * 0.5;
      }
    });
    
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get subcategories for selected category
  const getSubcategories = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.subcategories : [];
  };

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
              You have successfully completed the complaint categorization activity with a score of {previousScore}%.
              You demonstrated good understanding of cybercrime categories and classification.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const currentCaseData = cases[currentCase];
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="info">
              Case {currentCase + 1} of {cases.length}
            </Badge>
            <Badge variant={timeRemaining < 300 ? 'warning' : 'outline'}>
              Time: {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{activity.description}</p>

        {/* Current Case */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Case Study</h4>
            <Badge variant={
              currentCaseData.difficulty === 'easy' ? 'success' :
              currentCaseData.difficulty === 'medium' ? 'warning' : 'error'
            }>
              {currentCaseData.difficulty}
            </Badge>
          </div>
          <p className="text-gray-800 leading-relaxed">{currentCaseData.description}</p>
        </div>

        {!showFeedback ? (
          <>
            {/* Category Selection */}
            <div className="mb-6">
              <h5 className="text-lg font-medium text-gray-900 mb-4">Select Category</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`text-left p-4 border-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'border-police-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h6 className="font-semibold text-gray-900 mb-2">{category.name}</h6>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory Selection */}
            {selectedCategory && (
              <div className="mb-6">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Select Subcategory</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getSubcategories().map(subcategory => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSubcategory === subcategory
                          ? 'border-police-blue bg-blue-50 text-police-blue'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitCase}
                disabled={!selectedCategory || !selectedSubcategory}
                variant="primary"
              >
                Submit Classification
              </Button>
            </div>
          </>
        ) : (
          /* Feedback Section */
          <div className="mb-6">
            <div className={`border-2 rounded-lg p-6 ${
              responses[responses.length - 1]?.isCorrect
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  responses[responses.length - 1]?.isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {responses[responses.length - 1]?.isCorrect ? '✓' : '✗'}
                </div>
                <h5 className={`text-lg font-semibold ${
                  responses[responses.length - 1]?.isCorrect
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {responses[responses.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
                </h5>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Your Answer:</span> {selectedCategoryData?.name} → {selectedSubcategory}
                </div>
                <div>
                  <span className="font-medium">Correct Answer:</span> {
                    categories.find(cat => cat.id === currentCaseData.correctCategory)?.name
                  } → {currentCaseData.correctSubcategory}
                </div>
              </div>

              {!responses[responses.length - 1]?.isCorrect && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Explanation:</span> This case involves {currentCaseData.correctSubcategory.toLowerCase()} 
                    which falls under the {categories.find(cat => cat.id === currentCaseData.correctCategory)?.name} category.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleNextCase} variant="primary">
                {currentCase < cases.length - 1 ? 'Next Case' : 'Complete Activity'}
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {responses.length} / {cases.length} cases</span>
            <span>Current Score: {calculateScore()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-police-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(responses.length / cases.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComplaintCategorizationActivity;