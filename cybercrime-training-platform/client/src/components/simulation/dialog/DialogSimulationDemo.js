import React, { useState, useEffect } from 'react';
import DialogSimulationContainer from './DialogSimulationContainer';

/**
 * DialogSimulationDemo component
 * 
 * This component demonstrates how to use the dialog simulation system.
 */
const DialogSimulationDemo = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulationMode, setSimulationMode] = useState('roleplay');
  const [simulationResults, setSimulationResults] = useState(null);

  // Mock user profile
  const userProfile = {
    name: 'Officer Singh',
    avatarUrl: '/assets/avatars/officer.png',
    department: 'Cybercrime Unit',
    rank: 'Inspector'
  };

  // Load simulation data
  useEffect(() => {
    // In a real application, this would fetch from an API or import from a file
    const loadSimulationData = async () => {
      try {
        setIsLoading(true);
        
        // Import the example simulation
        const { default: createSimpleDialogExample } = await import('../../../simulation/examples/SimpleDialogExample');
        const exampleData = createSimpleDialogExample();
        
        setSimulationData(exampleData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading simulation data:', err);
        setError('Failed to load simulation data');
        setIsLoading(false);
      }
    };

    loadSimulationData();
  }, []);

  // Handle simulation completion
  const handleSimulationComplete = (results) => {
    console.log('Simulation completed:', results);
    setSimulationResults(results);
  };

  // Toggle simulation mode
  const toggleSimulationMode = () => {
    setSimulationMode(prevMode => prevMode === 'standard' ? 'roleplay' : 'standard');
  };

  // Reset simulation
  const resetSimulation = () => {
    setSimulationResults(null);
    // Reload the page to reset the simulation
    window.location.reload();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="dialog-simulation-demo-loading flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation demo...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="dialog-simulation-demo-error bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Demo Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dialog-simulation-demo">
      {/* Demo header */}
      <div className="demo-header bg-gray-100 p-4 mb-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dialog Simulation Demo</h2>
            <p className="text-gray-600">
              This demo showcases the dialog and roleplay system for the Cybercrime Training Platform.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={toggleSimulationMode}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Switch to {simulationMode === 'standard' ? 'Roleplay' : 'Standard'} Mode
            </button>
            
            <button
              onClick={resetSimulation}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Reset Simulation
            </button>
          </div>
        </div>
        
        {/* User profile */}
        <div className="user-profile mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="avatar w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl">
              {userProfile.name.charAt(0)}
            </div>
            <div className="ml-3">
              <div className="name font-medium">{userProfile.name}</div>
              <div className="details text-sm text-gray-500">
                {userProfile.rank}, {userProfile.department}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation container */}
      <div className="simulation-container">
        {simulationData && (
          <DialogSimulationContainer
            simulationData={simulationData}
            userProfile={userProfile}
            mode={simulationMode}
            onComplete={handleSimulationComplete}
          />
        )}
      </div>
      
      {/* Results display */}
      {simulationResults && (
        <div className="simulation-results mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Simulation Results</h3>
          
          <div className="results-content">
            <div className="score-summary flex justify-between items-center p-3 bg-white rounded-lg mb-3">
              <div className="text-gray-700">Final Score:</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(simulationResults.score * 10)}/100
              </div>
            </div>
            
            <div className="metrics-summary grid grid-cols-2 gap-3 mb-3">
              {Object.entries(simulationResults.metrics || {}).map(([metric, value]) => (
                <div key={metric} className="metric-item p-3 bg-white rounded-lg">
                  <div className="text-sm text-gray-500 capitalize">{metric}</div>
                  <div className="text-lg font-semibold">{Math.round(value * 10)}/10</div>
                </div>
              ))}
            </div>
            
            <div className="completion-message p-3 bg-white rounded-lg text-center">
              <p className="text-gray-700">
                You have completed the "{simulationData.title}" simulation.
              </p>
              <button
                onClick={resetSimulation}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogSimulationDemo;