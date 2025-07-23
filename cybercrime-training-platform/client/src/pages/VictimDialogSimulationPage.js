import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, Button } from '../components/ui';
import VictimDialogSystem from '../components/simulation/dialog/VictimDialogSystem';
import { dialogScenarios } from '../data/victimProfiles';

/**
 * Victim Dialog Simulation Page for practicing victim interviews
 */
const VictimDialogSimulationPage = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);

  // Handle scenario selection
  const handleScenarioSelect = (scenarioId) => {
    const scenario = dialogScenarios[scenarioId];
    setSelectedScenario(scenario);
    setSimulationResults(null);
  };

  // Handle simulation completion
  const handleSimulationComplete = (results) => {
    setSimulationResults(results);
    console.log('Dialog simulation completed:', results);
  };

  // Handle simulation progress
  const handleSimulationProgress = (progress) => {
    console.log('Dialog progress:', progress);
  };

  // Reset simulation
  const handleReset = () => {
    setSelectedScenario(null);
    setSimulationResults(null);
  };

  // If no scenario selected, show scenario selection
  if (!selectedScenario) {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Victim Interview Simulation
          </h1>
          <p className="text-gray-600">
            Practice your communication skills with cybercrime victims in realistic scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(dialogScenarios).map(([key, scenario]) => (
            <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
                    <img 
                      src={scenario.victim.imageUrl} 
                      alt={scenario.victim.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/64x64?text=" + scenario.victim.name.charAt(0);
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{scenario.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Victim:</span> {scenario.victim.name}, {scenario.victim.age} years old
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scenario.learningObjectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-police-blue mr-2">•</span>
                        {objective}
                      </li>
                    ))}
                    {scenario.learningObjectives.length > 2 && (
                      <li className="text-gray-500 italic">
                        +{scenario.learningObjectives.length - 2} more objectives...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ~{scenario.interactions.length * 2} minutes
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleScenarioSelect(key)}
                  >
                    Start Simulation
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Information Panel */}
        <Card className="mt-8">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Interactive Dialog</h4>
                <p className="text-sm text-gray-600">
                  Engage in realistic conversations with AI-powered victim characters
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Real-time Scoring</h4>
                <p className="text-sm text-gray-600">
                  Get instant feedback on empathy, professionalism, and information gathering
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Outcomes</h4>
                <p className="text-sm text-gray-600">
                  Develop skills in victim support, information extraction, and professional communication
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Layout>
    );
  }

  // Show simulation interface
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {selectedScenario.title}
            </h1>
            <p className="text-gray-600">{selectedScenario.description}</p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Scenarios
          </Button>
        </div>
      </div>

      <VictimDialogSystem
        scenario={selectedScenario}
        onComplete={handleSimulationComplete}
        onProgress={handleSimulationProgress}
      />

      {/* Results Summary (if completed) */}
      {simulationResults && (
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Communication Scores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Empathy:</span>
                    <span className="font-medium">{simulationResults.score.empathy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Information Gathering:</span>
                    <span className="font-medium">{simulationResults.score.information}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professionalism:</span>
                    <span className="font-medium">{simulationResults.score.professionalism}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Information Extracted</h4>
                <div className="text-sm text-gray-600">
                  {Object.keys(simulationResults.extractedInformation).length} pieces of information gathered
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </Layout>
  );
};

export default VictimDialogSimulationPage;