import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import DialogInterface from './DialogInterface';
import CommunicationMetrics from './CommunicationMetrics';
import DialogEngine from '../../../simulation/specialized/dialog/DialogEngine';
import { DialogTree, DialogParticipant } from '../../../simulation/specialized/dialog/DialogModels';
import { PARTICIPANT_TYPES, EMOTIONAL_STATES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * RoleplaySimulation component
 * 
 * This component provides a complete roleplay simulation experience with dialog,
 * character interactions, and communication quality scoring.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.simulationData - The simulation data
 * @param {Object} props.userProfile - The user profile data
 * @param {Function} props.onComplete - Callback when simulation is complete
 * @param {Function} props.onScoreUpdate - Callback when score is updated
 */
const RoleplaySimulation = ({
  simulationData,
  userProfile,
  onComplete,
  onScoreUpdate
}) => {
  const [dialogEngine, setDialogEngine] = useState(null);
  const [userCharacter, setUserCharacter] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [communicationMetrics, setCommunicationMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the roleplay simulation
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
      console.error('Error initializing roleplay simulation:', err);
      setError('Failed to initialize simulation');
      setIsLoading(false);
    }
  }, [simulationData, userProfile]);

  // Set up dialog engine event listeners
  useEffect(() => {
    if (!dialogEngine) return;

    const handleScoreUpdate = () => {
      const score = dialogEngine.getScore();
      const metrics = dialogEngine.getMetrics();
      
      setCurrentScore(score);
      setCommunicationMetrics(metrics);
      
      if (onScoreUpdate) {
        onScoreUpdate(score, metrics);
      }
    };

    const handleDialogComplete = (data) => {
      const finalScore = dialogEngine.getScore();
      const finalMetrics = dialogEngine.getMetrics();
      const dialogState = dialogEngine.getState();
      
      if (onComplete) {
        onComplete({
          score: finalScore,
          metrics: finalMetrics,
          state: dialogState,
          simulationData
        });
      }
    };

    const handleCommunicationScored = (data) => {
      handleScoreUpdate();
    };

    // Register event listeners
    dialogEngine.events.on('dialog:option:selected:complete', handleScoreUpdate);
    dialogEngine.events.on('dialog:complete', handleDialogComplete);
    dialogEngine.events.on('dialog:communication_scored', handleCommunicationScored);

    // Initialize the dialog engine
    dialogEngine.initialize();

    // Clean up event listeners
    return () => {
      dialogEngine.events.off('dialog:option:selected:complete', handleScoreUpdate);
      dialogEngine.events.off('dialog:complete', handleDialogComplete);
      dialogEngine.events.off('dialog:communication_scored', handleCommunicationScored);
    };
  }, [dialogEngine, onComplete, onScoreUpdate, simulationData]);

  // Start the simulation
  const startSimulation = useCallback(() => {
    if (dialogEngine && !dialogEngine.isComplete()) {
      dialogEngine.start();
    }
  }, [dialogEngine]);

  // Reset the simulation
  const resetSimulation = useCallback(() => {
    if (dialogEngine) {
      // Create a new dialog engine instance
      const dialogTree = new DialogTree(simulationData.dialogTree);
      dialogTree.addParticipant(userCharacter);
      
      const newEngine = new DialogEngine(dialogTree, {
        autoStart: false,
        trackMetrics: true,
        audioEnabled: true
      });
      
      setDialogEngine(newEngine);
      setCurrentScore(0);
      setCommunicationMetrics({});
    }
  }, [simulationData, userCharacter]);

  // Handle dialog completion
  const handleDialogComplete = useCallback((data) => {
    console.log('Dialog completed with data:', data);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="roleplay-simulation-loading flex items-center justify-center h-64">
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
      <div className="roleplay-simulation-error bg-red-50 border border-red-200 rounded-lg p-6">
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

  // Render the roleplay simulation
  return (
    <div className="roleplay-simulation bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Simulation header */}
      <div className="simulation-header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {simulationData.title || 'Roleplay Simulation'}
            </h2>
            <p className="text-blue-100">
              {simulationData.description || 'Practice your communication skills in this interactive scenario.'}
            </p>
          </div>
          
          {/* Score display */}
          <div className="text-right">
            <div className="text-sm text-blue-200">Current Score</div>
            <div className="text-3xl font-bold">{Math.round(currentScore)}</div>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex gap-3 mt-4">
          {!dialogEngine?.isComplete() && (
            <button
              onClick={startSimulation}
              className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors"
            >
              {dialogEngine?.getState()?.history?.length > 0 ? 'Continue' : 'Start Simulation'}
            </button>
          )}
          
          <button
            onClick={resetSimulation}
            className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main simulation content */}
      <div className="simulation-content flex">
        {/* Dialog interface */}
        <div className="dialog-section flex-grow">
          {dialogEngine && (
            <DialogInterface
              dialogEngine={dialogEngine}
              userCharacter={userCharacter}
              onDialogComplete={handleDialogComplete}
            />
          )}
        </div>

        {/* Communication metrics sidebar */}
        <div className="metrics-sidebar w-80 bg-gray-50 border-l border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Communication Quality</h3>
          
          <CommunicationMetrics
            metrics={communicationMetrics}
            score={currentScore}
            showDetails={true}
          />
          
          {/* Simulation info */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Simulation Info</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Characters: {Object.keys(dialogEngine?.getDialogTree()?.participants || {}).length}</div>
              <div>Progress: {dialogEngine?.getState()?.history?.length || 0} interactions</div>
              <div>Status: {dialogEngine?.isComplete() ? 'Complete' : 'In Progress'}</div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Show empathy and understanding</li>
              <li>• Use clear, professional language</li>
              <li>• Ask relevant questions</li>
              <li>• Remain patient and supportive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

RoleplaySimulation.propTypes = {
  simulationData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dialogTree: PropTypes.object.isRequired
  }).isRequired,
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  onComplete: PropTypes.func,
  onScoreUpdate: PropTypes.func
};

export default RoleplaySimulation;