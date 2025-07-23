import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormSimulationContainer from '../components/simulation/form/FormSimulationContainer';
import createNCRPFormExample from '../simulation/examples/NCRPFormExample';

/**
 * FormSimulationPage component
 * 
 * This page demonstrates the form simulation system for NCRP forms.
 */
const FormSimulationPage = () => {
  const navigate = useNavigate();
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user from Redux store with fallback
  const user = useSelector(state => state.auth?.user) || null;
  
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
      const exampleData = createNCRPFormExample();
      setSimulationData(exampleData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading simulation data:', error);
      setIsLoading(false);
    }
  }, []);
  
  // Handle simulation completion
  const handleSimulationComplete = (results) => {
    console.log('Form simulation completed with results:', results);
    setSimulationComplete(true);
    setSimulationResults({
      score: results.score * 10, // Convert to 0-100 scale
      accuracy: results.accuracy,
      completedAt: new Date().toISOString()
    });
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
          Form Simulation: NCRP Complaint Form
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
          <h2 className="text-xl font-bold mb-2">NCRP Form Completion Exercise</h2>
          <p className="text-gray-600 mb-4">
            Practice completing an NCRP complaint form by dragging the correct information to the appropriate fields.
            Your goal is to accurately complete the form based on the victim's statement.
          </p>
          
          {simulationComplete && simulationResults && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Form Submission Complete!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Overall Score:</p>
                  <p className="text-2xl font-bold">{Math.round(simulationResults.score)}</p>
                </div>
                <div>
                  <p className="font-medium">Form Accuracy:</p>
                  <p className="text-2xl font-bold">{Math.round(simulationResults.accuracy * 100)}%</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
                  onClick={handleRestart}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <FormSimulationContainer 
              simulationData={simulationData}
              userProfile={userProfile}
              onComplete={handleSimulationComplete}
            />
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">About This Simulation</h3>
        <p className="mb-4">
          This simulation tests your ability to accurately complete an NCRP complaint form based on 
          information provided by a cybercrime victim. You'll be scored on the following:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><span className="font-medium">Accuracy:</span> Placing the correct information in the right fields</li>
          <li><span className="font-medium">Completeness:</span> Filling in all required fields</li>
          <li><span className="font-medium">Speed:</span> Completing the form efficiently</li>
        </ul>
        <p>
          Drag and drop the information snippets to the appropriate form fields. Submit the form when you're confident it's complete.
        </p>
      </div>
    </div>
  );
};

export default FormSimulationPage;