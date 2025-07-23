import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SimulationEngine from '../../simulation/SimulationEngine';
import { SIMULATION_STATUS } from '../../simulation/models/SimulationTypes';
import Spinner from '../ui/Spinner';

/**
 * SimulationContainer component
 * 
 * This component wraps the simulation engine and provides a React interface
 * for rendering and interacting with simulations.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.simulationData - The simulation data
 * @param {Object} props.options - Configuration options for the simulation
 * @param {Function} props.onComplete - Callback when simulation completes
 * @param {Function} props.onProgress - Callback for simulation progress updates
 */
const SimulationContainer = ({ 
  simulationData, 
  options = {}, 
  onComplete, 
  onProgress 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engineState, setEngineState] = useState(null);
  
  // Reference to the simulation engine instance
  const engineRef = useRef(null);
  
  // Redux
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  useEffect(() => {
    // Initialize the simulation engine
    try {
      // Create the engine instance
      const engine = new SimulationEngine(simulationData, {
        ...options,
        initialState: {
          userId: user?.id
        }
      });
      
      // Store the engine reference
      engineRef.current = engine;
      
      // Initialize the engine
      engine.initialize();
      
      // Set up event listeners
      const onStateChange = () => {
        setEngineState({ ...engine.getState() });
        
        // Call the onProgress callback if provided
        if (onProgress) {
          onProgress({
            status: engine.getState().status,
            score: engine.getScore(),
            scorePercentage: engine.getScorePercentage(),
            isComplete: engine.isComplete()
          });
        }
      };
      
      const onComplete = (data) => {
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete({
            success: data.success,
            score: engine.getScore(),
            scorePercentage: engine.getScorePercentage(),
            state: engine.getState()
          });
        }
      };
      
      const onError = (data) => {
        setError(data.error.message);
      };
      
      // Register event listeners
      engine.events.on('simulation:start', onStateChange);
      engine.events.on('interaction:complete', onStateChange);
      engine.events.on('simulation:complete', onComplete);
      engine.events.on('simulation:error', onError);
      
      // Set initial state
      setEngineState(engine.getState());
      setLoading(false);
      
      // Auto-start if configured
      if (options.autoStart) {
        engine.start();
      }
      
      // Clean up on unmount
      return () => {
        // Remove event listeners
        engine.events.off('simulation:start', onStateChange);
        engine.events.off('interaction:complete', onStateChange);
        engine.events.off('simulation:complete', onComplete);
        engine.events.off('simulation:error', onError);
        
        // Destroy the engine
        engine.destroy();
      };
    } catch (err) {
      console.error('Error initializing simulation engine:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [simulationData, options, onComplete, onProgress, user]);
  
  // Handle user input
  const handleUserInput = (response) => {
    if (engineRef.current) {
      engineRef.current.handleUserInput(response);
    }
  };
  
  // Handle simulation control actions
  const handleStart = () => {
    if (engineRef.current) {
      engineRef.current.start();
    }
  };
  
  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  };
  
  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };
  
  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  // Render the simulation
  return (
    <div className="simulation-container">
      {/* Simulation controls */}
      <div className="simulation-controls mb-4 flex space-x-2">
        {engineState?.status === SIMULATION_STATUS.NOT_STARTED && (
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleStart}
          >
            Start
          </button>
        )}
        
        {engineState?.status === SIMULATION_STATUS.IN_PROGRESS && (
          <button 
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePause}
          >
            Pause
          </button>
        )}
        
        {engineState?.status === SIMULATION_STATUS.PAUSED && (
          <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleResume}
          >
            Resume
          </button>
        )}
        
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      
      {/* Simulation status */}
      <div className="simulation-status mb-4">
        <div className="flex items-center">
          <span className="mr-2 font-semibold">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${getStatusClass(engineState?.status)}`}>
            {formatStatus(engineState?.status)}
          </span>
        </div>
        
        {engineState?.status !== SIMULATION_STATUS.NOT_STARTED && (
          <div className="mt-2">
            <span className="mr-2 font-semibold">Score:</span>
            <span>{engineState?.score || 0}</span>
          </div>
        )}
      </div>
      
      {/* Render the simulation using the engine's renderer */}
      <div className="simulation-content">
        {engineRef.current && engineRef.current.render()}
      </div>
    </div>
  );
};

// Helper function to format the simulation status
const formatStatus = (status) => {
  switch (status) {
    case SIMULATION_STATUS.NOT_STARTED:
      return 'Not Started';
    case SIMULATION_STATUS.IN_PROGRESS:
      return 'In Progress';
    case SIMULATION_STATUS.COMPLETED:
      return 'Completed';
    case SIMULATION_STATUS.FAILED:
      return 'Failed';
    case SIMULATION_STATUS.PAUSED:
      return 'Paused';
    default:
      return 'Unknown';
  }
};

// Helper function to get the CSS class for a status
const getStatusClass = (status) => {
  switch (status) {
    case SIMULATION_STATUS.NOT_STARTED:
      return 'bg-gray-200 text-gray-800';
    case SIMULATION_STATUS.IN_PROGRESS:
      return 'bg-blue-200 text-blue-800';
    case SIMULATION_STATUS.COMPLETED:
      return 'bg-green-200 text-green-800';
    case SIMULATION_STATUS.FAILED:
      return 'bg-red-200 text-red-800';
    case SIMULATION_STATUS.PAUSED:
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default SimulationContainer;