import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DialogEngine from '../../../simulation/specialized/dialog/DialogEngine';
import { DialogTree, DialogParticipant } from '../../../simulation/specialized/dialog/DialogModels';
import { PARTICIPANT_TYPES } from '../../../simulation/specialized/dialog/DialogTypes';
import DialogInterface from './DialogInterface';
import CommunicationMetrics from './CommunicationMetrics';
import Spinner from '../../ui/Spinner';

/**
 * DialogSimulation component
 * 
 * This component integrates the dialog system with the simulation framework.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.simulation - The simulation data
 * @param {Object} props.options - Configuration options
 * @param {Function} props.onComplete - Callback when simulation completes
 * @param {Function} props.onProgress - Callback for simulation progress updates
 */
const DialogSimulation = ({ 
  simulation, 
  options = {}, 
  onComplete, 
  onProgress 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogEngine, setDialogEngine] = useState(null);
  const [dialogState, setDialogState] = useState(null);
  const [userCharacter, setUserCharacter] = useState(null);
  
  // Get the current user from Redux
  const user = useSelector(state => state.auth.user);
  
  // Initialize the dialog engine
  useEffect(() => {
    if (!simulation) {
      setError('No simulation data provided');
      setLoading(false);
      return;
    }
    
    try {
      // Create a dialog tree from the simulation data
      const dialogTree = new DialogTree({
        id: simulation.id,
        title: simulation.title,
        description: simulation.description,
        nodes: simulation.interactions.reduce((nodes, interaction) => {
          nodes[interaction.id] = {
            id: interaction.id,
            message: {
              type: interaction.type,
              content: interaction.prompt,
              participantId: interaction.metadata?.speakerId || 'system',
              participantType: interaction.metadata?.speakerId ? PARTICIPANT_TYPES.CHARACTER : PARTICIPANT_TYPES.SYSTEM
            },
            options: interaction.options.map(option => ({
              id: option.id,
              text: option.text,
              nextNodeId: option.nextInteractionId,
              metrics: {
                empathy: option.metadata?.metrics?.empathy || 0,
                clarity: option.metadata?.metrics?.clarity || 0,
                professionalism: option.metadata?.metrics?.professionalism || 0,
                accuracy: option.metadata?.metrics?.accuracy || 0,
                patience: option.metadata?.metrics?.patience || 0
              },
              feedback: option.feedback,
              isCorrect: option.isCorrect
            })),
            participantId: interaction.metadata?.speakerId,
            nextNodeId: interaction.nextInteractionId,
            isEndNode: !interaction.nextInteractionId && interaction.options.every(opt => !opt.nextInteractionId)
          };
          return nodes;
        }, {}),
        participants: {
          ...simulation.scenario.characters.reduce((participants, character) => {
            participants[character.id] = {
              id: character.id,
              name: character.name,
              type: PARTICIPANT_TYPES.CHARACTER,
              avatarUrl: character.avatarUrl,
              description: character.description,
              emotionalState: character.emotionalState
            };
            return participants;
          }, {}),
          // Add user as a participant
          user: {
            id: 'user',
            name: user?.name || 'Officer',
            type: PARTICIPANT_TYPES.USER,
            avatarUrl: user?.avatarUrl || '/assets/avatars/default-user.png',
            description: 'You, the police officer handling the case',
            emotionalState: 'neutral'
          }
        },
        rootNodeId: simulation.startInteractionId
      });
      
      // Create the dialog engine
      const engine = new DialogEngine(dialogTree, {
        ...options,
        autoStart: false
      });
      
      // Set the dialog engine
      setDialogEngine(engine);
      
      // Set the user character
      setUserCharacter(new DialogParticipant({
        id: 'user',
        name: user?.name || 'Officer',
        type: PARTICIPANT_TYPES.USER,
        avatarUrl: user?.avatarUrl || '/assets/avatars/default-user.png',
        description: 'You, the police officer handling the case',
        emotionalState: 'neutral'
      }));
      
      // Set up event listeners
      engine.events.on('dialog:node', () => {
        setDialogState({ ...engine.getState() });
        
        // Call the onProgress callback if provided
        if (onProgress) {
          onProgress({
            status: 'in_progress',
            score: engine.getScore(),
            metrics: engine.getMetrics(),
            isComplete: engine.isComplete()
          });
        }
      });
      
      engine.events.on('dialog:complete', (data) => {
        setDialogState({ ...engine.getState() });
        
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete({
            success: true,
            score: engine.getScore(),
            metrics: engine.getMetrics(),
            state: engine.getState()
          });
        }
      });
      
      // Initialize the engine
      engine.initialize();
      
      // Set loading to false
      setLoading(false);
      
      // Auto-start if configured
      if (options.autoStart) {
        engine.start();
      }
      
      // Clean up on unmount
      return () => {
        engine.destroy();
      };
    } catch (err) {
      console.error('Error initializing dialog engine:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [simulation, options, onComplete, onProgress, user]);
  
  // Handle dialog completion
  const handleDialogComplete = (data) => {
    console.log('Dialog completed:', data);
  };
  
  // Handle start button click
  const handleStart = () => {
    if (dialogEngine) {
      dialogEngine.start();
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
  
  // Render the dialog simulation
  return (
    <div className="dialog-simulation">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dialog interface */}
        <div className="lg:col-span-2">
          {dialogEngine ? (
            <div className="h-[600px]">
              <DialogInterface 
                dialogEngine={dialogEngine} 
                userCharacter={userCharacter}
                onDialogComplete={handleDialogComplete}
              />
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Warning!</strong>
              <span className="block sm:inline"> Dialog engine not initialized.</span>
            </div>
          )}
          
          {/* Start button */}
          {dialogEngine && !dialogEngine.getState().currentNodeId && (
            <div className="mt-4 text-center">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
                onClick={handleStart}
              >
                Start Dialog
              </button>
            </div>
          )}
        </div>
        
        {/* Communication metrics */}
        <div className="lg:col-span-1">
          {dialogState && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <CommunicationMetrics 
                metrics={dialogEngine.getMetrics()} 
                maxValue={10}
              />
              
              {/* Overall score */}
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold">
                  Score: {Math.round(dialogEngine.getScore())}
                </div>
                <div className="text-sm text-gray-500">
                  Based on your communication quality
                </div>
              </div>
              
              {/* Dialog status */}
              {dialogEngine.isComplete() && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-center text-green-700">
                    Dialog complete!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DialogSimulation.propTypes = {
  simulation: PropTypes.object.isRequired,
  options: PropTypes.object,
  onComplete: PropTypes.func,
  onProgress: PropTypes.func
};

export default DialogSimulation;