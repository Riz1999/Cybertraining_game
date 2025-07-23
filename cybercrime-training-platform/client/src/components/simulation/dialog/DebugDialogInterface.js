import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from './CharacterAvatar';
import { PARTICIPANT_TYPES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * DebugDialogInterface component
 * 
 * This is a simplified version of the DialogInterface component for debugging purposes.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dialogEngine - The dialog engine instance
 * @param {Object} props.userCharacter - The user character data
 * @param {Function} props.onDialogComplete - Callback when dialog is complete
 */
const DebugDialogInterface = ({ 
  dialogEngine, 
  userCharacter,
  onDialogComplete
}) => {
  const [currentNode, setCurrentNode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  // Initialize the dialog engine
  useEffect(() => {
    if (!dialogEngine) {
      setDebugInfo(prev => ({...prev, error: 'No dialog engine provided'}));
      return;
    }

    try {
      // Collect debug info
      setDebugInfo({
        engineInitialized: dialogEngine.initialized,
        dialogTreeExists: !!dialogEngine.getDialogTree(),
        rootNodeExists: !!dialogEngine.getDialogTree()?.getRootNode(),
        participantsCount: Object.keys(dialogEngine.getDialogTree()?.participants || {}).length,
        nodesCount: Object.keys(dialogEngine.getDialogTree()?.nodes || {}).length,
        userCharacterExists: !!userCharacter
      });

      // Set up event listeners
      const onDialogStart = () => {
        setDebugInfo(prev => ({...prev, event: 'dialog:start'}));
      };

      const onDialogNode = (data) => {
        const { node } = data;
        setCurrentNode(node);
        setDebugInfo(prev => ({
          ...prev, 
          event: 'dialog:node',
          currentNodeId: node?.id,
          hasMessage: !!node?.message,
          hasOptions: !!(node?.options && node.options.length > 0),
          participantId: node?.participantId
        }));
      };

      const onDialogOptionSelected = (data) => {
        setIsProcessing(true);
        setDebugInfo(prev => ({...prev, event: 'dialog:option:selected', optionId: data.optionId}));
      };

      const onDialogComplete = (data) => {
        setDebugInfo(prev => ({...prev, event: 'dialog:complete'}));
        if (onDialogComplete) {
          onDialogComplete(data);
        }
      };

      // Register event listeners
      dialogEngine.events.on('dialog:start', onDialogStart);
      dialogEngine.events.on('dialog:node', onDialogNode);
      dialogEngine.events.on('dialog:option:selected', onDialogOptionSelected);
      dialogEngine.events.on('dialog:option:selected:complete', () => setIsProcessing(false));
      dialogEngine.events.on('dialog:complete', onDialogComplete);

      // Initialize the dialog engine if not already initialized
      if (!dialogEngine.initialized) {
        dialogEngine.initialize();
      }

      // Clean up event listeners on unmount
      return () => {
        dialogEngine.events.off('dialog:start', onDialogStart);
        dialogEngine.events.off('dialog:node', onDialogNode);
        dialogEngine.events.off('dialog:option:selected', onDialogOptionSelected);
        dialogEngine.events.off('dialog:option:selected:complete', () => setIsProcessing(false));
        dialogEngine.events.off('dialog:complete', onDialogComplete);
      };
    } catch (err) {
      setDebugInfo(prev => ({...prev, error: err.message, stack: err.stack}));
    }
  }, [dialogEngine, onDialogComplete]);

  // Handle option selection
  const handleOptionSelect = (optionId) => {
    if (isProcessing) return;
    
    try {
      dialogEngine.selectOption(optionId);
    } catch (err) {
      setDebugInfo(prev => ({...prev, selectOptionError: err.message}));
    }
  };

  // Start the dialog
  const handleStartDialog = () => {
    try {
      dialogEngine.start();
      setDebugInfo(prev => ({...prev, action: 'dialog-started'}));
    } catch (err) {
      setDebugInfo(prev => ({...prev, startError: err.message}));
    }
  };

  // Render the debug interface
  return (
    <div className="debug-dialog-interface bg-gray-50 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Debug header */}
      <div className="debug-header bg-blue-100 p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Debug Dialog Interface</h3>
        <p className="text-sm text-gray-700">
          This is a simplified interface for debugging dialog issues
        </p>
      </div>
      
      {/* Debug info */}
      <div className="debug-info p-4 bg-gray-100 border-b border-gray-200">
        <h4 className="font-medium mb-2">Debug Information:</h4>
        <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      {/* Dialog controls */}
      <div className="dialog-controls p-4">
        <button
          onClick={handleStartDialog}
          disabled={!dialogEngine || isProcessing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Dialog
        </button>
      </div>
      
      {/* Current node */}
      {currentNode && (
        <div className="current-node p-4 border-t border-gray-200">
          <h4 className="font-medium mb-2">Current Node:</h4>
          <div className="bg-white p-3 rounded">
            <p className="font-medium">{currentNode.id}</p>
            {currentNode.message && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">{currentNode.message.content}</p>
              </div>
            )}
          </div>
          
          {/* Options */}
          {currentNode.options && currentNode.options.length > 0 && (
            <div className="options mt-4">
              <h5 className="font-medium mb-2">Options:</h5>
              <div className="space-y-2">
                {currentNode.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isProcessing}
                    className="w-full text-left p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* User character */}
      {userCharacter && (
        <div className="user-character p-4 border-t border-gray-200">
          <h4 className="font-medium mb-2">User Character:</h4>
          <div className="flex items-center">
            <CharacterAvatar 
              character={userCharacter} 
              size="md" 
              showName={true} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

DebugDialogInterface.propTypes = {
  dialogEngine: PropTypes.object,
  userCharacter: PropTypes.object,
  onDialogComplete: PropTypes.func
};

export default DebugDialogInterface;