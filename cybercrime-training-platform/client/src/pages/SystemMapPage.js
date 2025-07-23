import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapSimulationContainer } from '../components/simulation/map';
import { Simulation, Scenario } from '../simulation/models/SimulationModels';
import { SIMULATION_TYPES } from '../simulation/models/SimulationTypes';

/**
 * SystemMapPage Component
 * 
 * Dedicated page for the System Map exploration activity from Module 1.
 * This page demonstrates the interactive cybercrime systems map.
 */
const SystemMapPage = () => {
  const navigate = useNavigate();
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  // Create the system map simulation data
  const createSystemMapSimulation = () => {
    const scenario = new Scenario({
      title: 'Cybercrime Investigation Systems',
      description: 'Explore the interconnected systems used in cybercrime investigation in India',
      context: 'Understanding these systems is crucial for effective cybercrime investigation',
      metadata: {
        mapData: {
          systems: [
            {
              id: 'ncrp',
              name: 'NCRP',
              description: 'National Cybercrime Reporting Portal',
              details: 'The primary portal for reporting cybercrimes in India. Citizens can file complaints online, track their status, and receive updates on investigations. It serves as the first point of contact for cybercrime victims.',
              position: { x: 150, y: 120 },
              keyFeatures: [
                'Online complaint filing system',
                'Case status tracking for victims',
                'Digital evidence submission portal',
                'Multi-language support for accessibility',
                'Integration with law enforcement databases'
              ]
            },
            {
              id: 'i4c',
              name: 'I4C',
              description: 'Indian Cyber Crime Coordination Centre',
              details: 'Coordinates cybercrime investigation across states and provides technical support to law enforcement agencies. It acts as the central hub for cybercrime coordination and policy development.',
              position: { x: 450, y: 120 },
              keyFeatures: [
                'Inter-state investigation coordination',
                'Technical expertise and support',
                'Training programs for law enforcement',
                'Policy development and guidelines',
                'International cooperation facilitation'
              ]
            },
            {
              id: 'helpline-1930',
              name: '1930',
              description: 'National Cybercrime Helpline',
              details: 'Immediate assistance for cybercrime victims. Available 24/7 for reporting incidents and getting guidance. Provides immediate response and victim counseling services.',
              position: { x: 300, y: 250 },
              keyFeatures: [
                '24/7 availability for emergencies',
                'Immediate incident response',
                'Victim counseling and support',
                'Emergency assistance coordination',
                'Real-time guidance for ongoing crimes'
              ]
            },
            {
              id: 'cctns',
              name: 'CCTNS',
              description: 'Crime and Criminal Tracking Network & Systems',
              details: 'Comprehensive crime tracking system that maintains records of crimes, criminals, and investigation progress across the country. It enables seamless information sharing between agencies.',
              position: { x: 150, y: 300 },
              keyFeatures: [
                'Comprehensive crime database',
                'Criminal records management',
                'Investigation progress tracking',
                'Inter-agency information sharing',
                'Analytics and reporting tools'
              ]
            }
          ],
          connections: [
            { from: 'ncrp', to: 'i4c' },
            { from: 'ncrp', to: 'helpline-1930' },
            { from: 'i4c', to: 'cctns' },
            { from: 'helpline-1930', to: 'cctns' }
          ]
        }
      }
    });

    return new Simulation({
      type: SIMULATION_TYPES.MAP,
      title: 'Cybercrime Systems Map Exploration',
      description: 'Explore the interconnected systems used in cybercrime investigation. Click on each system to learn about its role and functions in the cybercrime investigation ecosystem.',
      scenario,
      interactions: [], // Map simulations don't use traditional interactions
      outcomes: [],
      assets: [],
      metadata: {
        module: 'Module 1: Introduction to Cybercrime Investigation',
        activity: '5.3 Build System Map clickthrough experience',
        estimatedTime: 20,
        maxScore: 100
      }
    });
  };

  const simulation = createSystemMapSimulation();

  // Handle simulation completion
  const handleSimulationComplete = (data) => {
    setCompletionData(data);
    setSimulationComplete(true);
    
    console.log('System Map simulation completed:', data);
  };

  // Handle simulation progress
  const handleSimulationProgress = (progress) => {
    console.log('System Map progress:', progress);
  };

  // Handle navigation back to modules
  const handleBackToModules = () => {
    navigate('/modules');
  };

  // Handle restart simulation
  const handleRestart = () => {
    setSimulationComplete(false);
    setCompletionData(null);
  };

  return (
    <div className="system-map-page min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                System Map Exploration
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Module 1: Introduction to Cybercrime Investigation
              </p>
            </div>
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Modules
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!simulationComplete ? (
          <MapSimulationContainer
            simulation={simulation}
            onComplete={handleSimulationComplete}
            onProgress={handleSimulationProgress}
          />
        ) : (
          /* Completion Screen */
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-lg text-gray-600">
                You have successfully completed the System Map exploration!
              </p>
            </div>

            {/* Results Summary */}
            {completionData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {completionData.score}
                    </div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((completionData.score / completionData.maxScore) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(completionData.timeSpent / 60)}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                </div>

                {/* Knowledge Check Results */}
                {completionData.knowledgeCheckResults && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Knowledge Check Results
                    </h4>
                    <p className="text-gray-600">
                      {completionData.knowledgeCheckResults.correctAnswers} out of{' '}
                      {completionData.knowledgeCheckResults.totalQuestions} questions correct
                      ({Math.round(completionData.knowledgeCheckResults.score)}%)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button
                onClick={handleBackToModules}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Next Activity
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>
              This activity helps you understand the cybercrime investigation ecosystem in India.
              Each system plays a crucial role in combating cybercrime effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMapPage;