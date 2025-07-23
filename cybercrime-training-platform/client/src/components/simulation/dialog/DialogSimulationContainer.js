import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EnhancedDialogContainer from './EnhancedDialogContainer';
import RoleplaySimulation from './RoleplaySimulation';
import DebugDialogInterface from './DebugDialogInterface';
import DialogEngine from '../../../simulation/specialized/dialog/DialogEngine';
import { DialogTree, DialogParticipant } from '../../../simulation/specialized/dialog/DialogModels';
import { PARTICIPANT_TYPES, EMOTIONAL_STATES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * DialogSimulationContainer component
 * 
 * This component serves as the main container for dialog simulations,
 * providing configuration options and simulation management.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.simulationData - The simulation data
 * @param {Object} props.userProfile - The user profile data
 * @param {string} props.mode - The simulation mode ('standard' or 'roleplay')
 * @param {Function} props.onComplete - Callback when simulation is complete
 */
const DialogSimulationContainer = ({
  simulationData,
  userProfile,
  mode = 'standard',
  onComplete
}) => {
  const [dialogEngine, setDialogEngine] = useState(null);
  const [userCharacter, setUserCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulationScore, setSimulationScore] = useState(0);
  const [simulationMetrics, setSimulationMetrics] = useState({});

  // Initialize the dialog simulation
  useEffect(() => {
    if (!simulationData) {
      setError('No simulation data provided');
      setIsLoading(false);
      return;
    }

    try {
      // Create the dialog tree from simulation data
      const dialogTree = new DialogTree(simulationData.dialogTree);
      
      // Create the user character
      const userChar = new DialogParticipant({
        id: 'user',
        name: userProfile?.name || 'Officer',
        type: PARTICIPANT_TYPES.USER,
        avatarUrl: userProfile?.avatarUrl || '',
        description: 'Police Officer in Training',
        emotionalState: EMOTIONAL_STATES.NEUTRAL
      });
      
      // Add user character to dialog tree
      dialogTree.addParticipant(userChar);
      
      // Create the dialog engine
      const engine = new DialogEngine(dialogTree, {
        autoStart: false,
        trackMetrics: true,
        audioEnabled: true
      });
      
      setDialogEngine(engine);
      setUserCharacter(userChar);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Error initializing dialog simulation:', err);
      setError('Failed to initialize simulation');
      setIsLoading(false);
    }
  }, [simulationData, userProfile]);

  // Handle simulation completion
  const handleSimulationComplete = (data) => {
    if (onComplete) {
      onComplete(data);
    }
  };

  // Handle score update
  const handleScoreUpdate = (score, metrics) => {
    setSimulationScore(score);
    setSimulationMetrics(metrics);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="dialog-simulation-loading flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="dialog-simulation-error bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Simulation Error</h3>
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

  // Render the appropriate simulation mode
  return (
    <div className="dialog-simulation-container">
      {mode === 'roleplay' ? (
        <RoleplaySimulation
          simulationData={simulationData}
          userProfile={userProfile}
          onComplete={handleSimulationComplete}
          onScoreUpdate={handleScoreUpdate}
        />
      ) : (
        <EnhancedDialogContainer
          dialogEngine={dialogEngine}
          userCharacter={userCharacter}
          audioEnabled={true}
          showHistory={true}
          onDialogComplete={handleSimulationComplete}
        />
      )}
    </div>
  );
};

DialogSimulationContainer.propTypes = {
  simulationData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dialogTree: PropTypes.object.isRequired
  }).isRequired,
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  mode: PropTypes.oneOf(['standard', 'roleplay']),
  onComplete: PropTypes.func
};

export default DialogSimulationContainer;