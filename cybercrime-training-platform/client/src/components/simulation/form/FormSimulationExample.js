import React, { useState } from 'react';
import NCRPFormSimulation from './NCRPFormSimulation';

/**
 * FormSimulationExample component
 * 
 * This component demonstrates the form simulation functionality with a sample scenario.
 * It can be used for testing and showcasing the form simulation features.
 */
const FormSimulationExample = () => {
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Sample scenario for demonstration
  const sampleScenario = {
    victim: {
      name: 'Priya Sharma',
      phone: '+91-9876543210',
      email: 'priya.sharma@gmail.com',
      address: 'B-42, Lajpat Nagar, New Delhi - 110024'
    },
    incident: {
      date: '2024-01-20',
      time: '16:45',
      category: 'Financial Fraud',
      description: 'Received a call from someone claiming to be from my bank. They asked for my debit card details and OTP. After providing the information, ₹75,000 was debited from my account without my knowledge.'
    },
    suspect: {
      phone: '+91-7654321098',
      account: '9876543210987654'
    },
    evidence: {
      transactionId: 'UTR987654321098',
      amount: '75000',
      bankName: 'HDFC Bank'
    },
    description: 'A victim of financial fraud has approached the cybercrime cell. Complete the NCRP form using the provided information to register the complaint properly.'
  };

  const handleSimulationComplete = (simulationResults) => {
    setResults(simulationResults);
    setShowResults(true);
  };

  const handleRestart = () => {
    setResults(null);
    setShowResults(false);
  };

  if (showResults && results) {
    return (
      <div className="form-simulation-example">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Form Simulation Complete!
              </h2>
              <div className="text-6xl mb-4">
                {results.performanceLevel === 'Excellent' ? '🏆' : 
                 results.performanceLevel === 'Very Good' ? '🥇' :
                 results.performanceLevel === 'Good' ? '🥈' :
                 results.performanceLevel === 'Satisfactory' ? '🥉' : '📝'}
              </div>
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.totalScore}%
                </div>
                <div className="text-sm text-blue-800">Overall Score</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(results.accuracy * 100)}%
                </div>
                <div className="text-sm text-green-800">Accuracy</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.timeSpent)}s
                </div>
                <div className="text-sm text-purple-800">Time Spent</div>
              </div>
            </div>

            {/* Performance Level */}
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Performance Level</h3>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    results.performanceLevel === 'Excellent' ? 'bg-green-100 text-green-800' :
                    results.performanceLevel === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                    results.performanceLevel === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    results.performanceLevel === 'Satisfactory' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {results.performanceLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Score Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Accuracy ({Math.round(results.weights.accuracy * 100)}%)</span>
                  <span className="font-medium">{results.breakdown.accuracy}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion ({Math.round(results.weights.completion * 100)}%)</span>
                  <span className="font-medium">{results.breakdown.completion}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Speed ({Math.round(results.weights.speed * 100)}%)</span>
                  <span className="font-medium">{results.breakdown.speed}/100</span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {results.feedback && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Feedback</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 mb-3">{results.feedback.summary}</p>
                  
                  {results.feedback.strengths.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-green-800 mb-1">Strengths:</h4>
                      <ul className="list-disc list-inside text-sm text-green-700">
                        {results.feedback.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.feedback.recommendations.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-orange-800 mb-1">Recommendations:</h4>
                      <ul className="list-disc list-inside text-sm text-orange-700">
                        {results.feedback.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.feedback.nextSteps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Next Steps:</h4>
                      <ul className="list-disc list-inside text-sm text-blue-700">
                        {results.feedback.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-simulation-example">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form Simulation Demo
          </h1>
          <p className="text-gray-600">
            This demonstration shows the NCRP form completion simulation. 
            Practice completing cybercrime complaint forms with realistic scenarios.
          </p>
        </div>

        <NCRPFormSimulation
          scenario={sampleScenario}
          onComplete={handleSimulationComplete}
          userProfile={{
            name: 'Demo User',
            avatarUrl: null
          }}
        />
      </div>
    </div>
  );
};

export default FormSimulationExample;