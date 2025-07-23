import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, Button } from '../components/ui';
import ComplaintCategorizationInterface from '../components/modules/ComplaintCategorizationInterface';
import { 
  categorizationScenarios, 
  getScenariosByDifficulty, 
  getRandomScenarios 
} from '../data/categorizationData';

/**
 * Complaint Categorization Page for training officers in cybercrime classification
 */
const ComplaintCategorizationPage = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [results, setResults] = useState(null);

  // Handle mode selection
  const handleModeSelect = (mode) => {
    let selectedScenarios = [];
    
    switch (mode) {
      case 'beginner':
        selectedScenarios = getScenariosByDifficulty('easy');
        break;
      case 'intermediate':
        selectedScenarios = getScenariosByDifficulty('medium');
        break;
      case 'advanced':
        selectedScenarios = getScenariosByDifficulty('hard');
        break;
      case 'mixed':
        selectedScenarios = getRandomScenarios(8);
        break;
      case 'all':
        selectedScenarios = [...categorizationScenarios];
        break;
      default:
        selectedScenarios = getRandomScenarios(5);
    }
    
    setScenarios(selectedScenarios);
    setSelectedMode(mode);
    setResults(null);
  };

  // Handle exercise completion
  const handleComplete = (exerciseResults) => {
    setResults(exerciseResults);
    console.log('Categorization exercise completed:', exerciseResults);
  };

  // Handle exercise progress
  const handleProgress = (progress) => {
    console.log('Categorization progress:', progress);
  };

  // Reset to mode selection
  const handleReset = () => {
    setSelectedMode(null);
    setScenarios([]);
    setResults(null);
  };

  // If no mode selected, show mode selection
  if (!selectedMode) {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Complaint Categorization Training
          </h1>
          <p className="text-gray-600">
            Learn to accurately categorize different types of cybercrime complaints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Beginner Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Beginner Level</h3>
              <p className="text-gray-600 mb-4">
                Start with clear-cut cases that are easy to categorize. Perfect for learning the basics.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • {getScenariosByDifficulty('easy').length} scenarios
                • Clear examples
                • Basic categories
              </div>
              <Button
                variant="primary"
                onClick={() => handleModeSelect('beginner')}
                className="w-full"
              >
                Start Beginner
              </Button>
            </div>
          </Card>

          {/* Intermediate Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Intermediate Level</h3>
              <p className="text-gray-600 mb-4">
                More complex scenarios that require careful analysis and understanding of nuances.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • {getScenariosByDifficulty('medium').length} scenarios
                • Moderate complexity
                • Multiple elements
              </div>
              <Button
                variant="primary"
                onClick={() => handleModeSelect('intermediate')}
                className="w-full"
              >
                Start Intermediate
              </Button>
            </div>
          </Card>

          {/* Advanced Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Level</h3>
              <p className="text-gray-600 mb-4">
                Challenging cases with overlapping categories and complex scenarios requiring expert judgment.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • {getScenariosByDifficulty('hard').length} scenarios
                • High complexity
                • Expert level
              </div>
              <Button
                variant="primary"
                onClick={() => handleModeSelect('advanced')}
                className="w-full"
              >
                Start Advanced
              </Button>
            </div>
          </Card>

          {/* Mixed Mode */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mixed Practice</h3>
              <p className="text-gray-600 mb-4">
                Random selection of scenarios from all difficulty levels for comprehensive practice.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • 8 random scenarios
                • All difficulty levels
                • Comprehensive test
              </div>
              <Button
                variant="primary"
                onClick={() => handleModeSelect('mixed')}
                className="w-full"
              >
                Start Mixed Practice
              </Button>
            </div>
          </Card>

          {/* Complete Assessment */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Assessment</h3>
              <p className="text-gray-600 mb-4">
                Full assessment with all scenarios to test your complete understanding of categorization.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                • All {categorizationScenarios.length} scenarios
                • Complete evaluation
                • Certification ready
              </div>
              <Button
                variant="primary"
                onClick={() => handleModeSelect('all')}
                className="w-full"
              >
                Start Assessment
              </Button>
            </div>
          </Card>
        </div>

        {/* Information Panel */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About Complaint Categorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Why Categorization Matters</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensures proper investigation procedures</li>
                  <li>• Helps in resource allocation</li>
                  <li>• Improves case tracking and statistics</li>
                  <li>• Enables appropriate legal action</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Categories Covered</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Financial Fraud & Banking Crimes</li>
                  <li>• Social Media & Communication Crimes</li>
                  <li>• Identity Theft & Impersonation</li>
                  <li>• Hacking & Unauthorized Access</li>
                  <li>• Romance & Investment Scams</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </Layout>
    );
  }

  // Show categorization interface
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Complaint Categorization - {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Level
            </h1>
            <p className="text-gray-600">
              Categorize cybercrime complaints accurately based on the scenario details
            </p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Modes
          </Button>
        </div>
      </div>

      <ComplaintCategorizationInterface
        scenarios={scenarios}
        onComplete={handleComplete}
        onProgress={handleProgress}
      />

      {/* Results Summary (if completed) */}
      {results && (
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Final Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.totalScore}</div>
                <div className="text-sm text-blue-800">Total Points</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.accuracy.toFixed(1)}%</div>
                <div className="text-sm text-green-800">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {results.results.filter(r => r.isCorrect).length}/{results.results.length}
                </div>
                <div className="text-sm text-purple-800">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.accuracy >= 80 ? 'PASS' : 'RETRY'}
                </div>
                <div className="text-sm text-yellow-800">Result</div>
              </div>
            </div>
            
            {results.accuracy >= 80 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Excellent work! You have demonstrated strong understanding of cybercrime categorization.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-800 font-medium">
                    Good effort! Review the feedback and try again to improve your categorization skills.
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </Layout>
  );
};

export default ComplaintCategorizationPage;