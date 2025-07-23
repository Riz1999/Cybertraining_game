import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DialogSimulationContainer from '../components/simulation/dialog/DialogSimulationContainer';
import createSimpleDialogExample from '../simulation/examples/SimpleDialogExample';

/**
 * DialogSimulationPage component
 * 
 * This page demonstrates the dialog simulation system.
 */
const DialogSimulationPage = () => {
  const navigate = useNavigate();
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user from Redux store
  const user = useSelector(state => state.auth.user);
  
  // Create user profile for the simulation
  const userProfile = {
    name: user?.name || 'Officer',
    avatarUrl: user?.avatarUrl || '/assets/avatars/default-user.png',
    department: user?.department || 'Cybercrime Unit',
    rank: user?.rank || 'Inspector'
  };
  
  // Load simulation data
  useEffect(() => {
    try {
      setIsLoading(true);
      // Create the simulation data using our example
      const exampleData = createSimpleDialogExample();
      setSimulationData(exampleData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading simulation data:', error);
      setIsLoading(false);
    }
  }, []);
  
  // Handle simulation completion
  const handleSimulationComplete = (results) => {
    console.log('Simulation completed:', results);
    setSimulationComplete(true);
    setSimulationResults(results);
  };
  

  
  // Handle restart button click
  const handleRestart = () => {
    window.location.reload();
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Dialog Simulation: Victim Interview
        </h1>
        
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">Online Banking Fraud Interview</h2>
          <p className="text-gray-600 mb-4">
            Practice interviewing a victim of online banking fraud with empathy and professionalism.
            Your goal is to gather the necessary information while providing support to the victim.
          </p>
          
          {simulationComplete && simulationResults && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Simulation Complete!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Overall Score:</p>
                  <p className="text-2xl font-bold">{Math.round(simulationResults.score)}</p>
                </div>
                <div>
                  <p className="font-medium">Communication Metrics:</p>
                  <ul className="list-disc list-inside">
                    {Object.entries(simulationResults.metrics).map(([metric, value]) => (
                      <li key={metric}>
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
                  onClick={handleRestart}
                >
                  Restart Simulation
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <DialogSimulationContainer 
              simulationData={simulationData}
              userProfile={userProfile}
              mode="roleplay"
              onComplete={handleSimulationComplete}
            />
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">About This Simulation</h3>
        <p className="mb-4">
          This simulation tests your ability to handle a cybercrime complaint with empathy, 
          professionalism, and accuracy. You&apos;ll be scored on the following metrics:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><span className="font-medium">Empathy:</span> Understanding and addressing the emotional needs of the victim</li>
          <li><span className="font-medium">Clarity:</span> Communicating information clearly and concisely</li>
          <li><span className="font-medium">Professionalism:</span> Maintaining a professional demeanor and following protocols</li>
          <li><span className="font-medium">Accuracy:</span> Providing accurate information and guidance</li>
          <li><span className="font-medium">Patience:</span> Taking time to listen and respond appropriately</li>
        </ul>
        <p>
          Choose your responses carefully, as they will affect how the victim responds and your overall score.
        </p>
      </div>
    </div>
  );
};

export default DialogSimulationPage;