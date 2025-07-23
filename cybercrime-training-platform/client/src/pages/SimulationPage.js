import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SimulationContainer from '../components/simulation/SimulationContainer';
import { loadSimulation, saveSimulationProgress, selectCurrentSimulation, selectSimulationLoading, selectSimulationError } from '../store/slices/simulationSlice';
import Spinner from '../components/ui/Spinner';
import exampleSimulations from '../simulation/examples/ExampleSimulation';

/**
 * SimulationPage component
 * 
 * This page displays and manages a simulation.
 */
const SimulationPage = () => {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const currentSimulation = useSelector(selectCurrentSimulation);
  const loading = useSelector(selectSimulationLoading);
  const error = useSelector(selectSimulationError);
  
  // Local state for demo purposes
  const [demoMode, setDemoMode] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('dialogSimulation');
  
  // Load the simulation when the component mounts
  useEffect(() => {
    if (simulationId && !demoMode) {
      dispatch(loadSimulation(simulationId));
    }
  }, [dispatch, simulationId, demoMode]);
  
  // Handle simulation completion
  const handleSimulationComplete = (result) => {
    console.log('Simulation completed:', result);
    
    // Save progress to the backend
    if (simulationId && !demoMode) {
      dispatch(saveSimulationProgress({
        simulationId,
        progressData: {
          completed: true,
          score: result.score,
          scorePercentage: result.scorePercentage,
          completedAt: new Date().toISOString()
        }
      }));
    }
    
    // Show completion message
    alert(`Simulation completed! Score: ${result.score} (${result.scorePercentage}%)`);
  };
  
  // Handle simulation progress updates
  const handleSimulationProgress = (progress) => {
    console.log('Simulation progress:', progress);
  };
  
  // Handle demo selection change
  const handleDemoChange = (e) => {
    setSelectedDemo(e.target.value);
  };
  
  // Toggle demo mode
  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };
  
  // Get the simulation data to use
  const getSimulationData = () => {
    if (demoMode) {
      return exampleSimulations[selectedDemo];
    }
    return currentSimulation;
  };
  
  // Render loading state
  if (loading && !demoMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Render error state
  if (error && !demoMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Get the simulation data
  const simulationData = getSimulationData();
  
  // Render the page
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {demoMode ? 'Simulation Demo' : 'Simulation'}
        </h1>
        
        <div className="flex items-center">
          <button 
            className={`mr-4 px-4 py-2 rounded ${demoMode ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            onClick={toggleDemoMode}
          >
            {demoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}
          </button>
          
          <button 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
      
      {demoMode && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Demo Selection</h2>
          <select 
            className="w-full p-2 border rounded"
            value={selectedDemo}
            onChange={handleDemoChange}
          >
            <option value="dialogSimulation">Dialog Simulation - Complaint Intake</option>
            <option value="formSimulation">Form Simulation - NCRP Form</option>
            <option value="timerSimulation">Timer Simulation - Transaction Freezing</option>
          </select>
        </div>
      )}
      
      {simulationData ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{simulationData.title}</h2>
            <p className="text-gray-600 mb-4">{simulationData.description}</p>
            
            <SimulationContainer 
              simulationData={simulationData}
              options={{ autoStart: false }}
              onComplete={handleSimulationComplete}
              onProgress={handleSimulationProgress}
            />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No simulation found!</strong>
          <span className="block sm:inline"> Please select a valid simulation.</span>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;