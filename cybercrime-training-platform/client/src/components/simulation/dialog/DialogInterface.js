import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DialogMessage from './DialogMessage';
import ResponseOptions from './ResponseOptions';
import CharacterAvatar from './CharacterAvatar';
import { MESSAGE_TYPES, PARTICIPANT_TYPES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * DialogInterface component
 * 
 * This component renders the main dialog interface with messages and response options.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dialogEngine - The dialog engine instance
 * @param {Object} props.userCharacter - The user character data
 * @param {Function} props.onDialogComplete - Callback when dialog is complete
 */
const DialogInterface = ({ 
  dialogEngine, 
  userCharacter,
  onDialogComplete
}) => {
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize the dialog engine
  useEffect(() => {
    if (!dialogEngine) return;

    // Set up event listeners
    const onDialogStart = () => {
      // Reset state
      setMessages([]);
      setCurrentNode(null);
      setSelectedOption(null);
    };

    const onDialogNode = (data) => {
      const { node } = data;
      setCurrentNode(node);
      
      // Add the node message to the messages list
      if (node.message) {
        const participant = dialogEngine.getDialogTree().getParticipant(node.participantId);
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: node.id,
            message: node.message,
            participant
          }
        ]);
      }
    };

    const onDialogOptionSelected = (data) => {
      setIsProcessing(true);
      setSelectedOption(data.optionId);
    };

    const onDialogComplete = (data) => {
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
  }, [dialogEngine, onDialogComplete]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isProcessing) return;
    
    dialogEngine.selectOption(option.id);
  };

  // Handle audio playback
  const handleAudioPlay = (messageId) => {
    console.log(`Playing audio for message ${messageId}`);
  };

  // Handle audio end
  const handleAudioEnd = (messageId) => {
    console.log(`Audio ended for message ${messageId}`);
  };

  // Render the dialog interface
  return (
    <div className="dialog-interface bg-gray-50 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Dialog header */}
      <div className="dialog-header bg-white p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {dialogEngine?.getDialogTree()?.title || 'Dialog'}
        </h3>
        <p className="text-sm text-gray-500">
          {dialogEngine?.getDialogTree()?.description || ''}
        </p>
      </div>
      
      {/* Dialog messages */}
      <div className="dialog-messages flex-grow p-4 overflow-y-auto">
        {messages.map(({ id, message, participant }) => (
          <DialogMessage
            key={id}
            message={message}
            participant={participant}
            isUser={message.participantType === PARTICIPANT_TYPES.USER}
            onAudioPlay={handleAudioPlay}
            onAudioEnd={handleAudioEnd}
          />
        ))}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Response options */}
      {currentNode && currentNode.options && currentNode.options.length > 0 && (
        <div className="dialog-response p-4 bg-gray-100 border-t border-gray-200">
          {/* User avatar */}
          {userCharacter && (
            <div className="flex items-center mb-3">
              <CharacterAvatar 
                character={userCharacter} 
                size="sm" 
                showName={true} 
              />
              <span className="ml-2 text-sm text-gray-500">Your response:</span>
            </div>
          )}
          
          {/* Response options */}
          <ResponseOptions 
            options={currentNode.options} 
            onSelect={handleOptionSelect} 
            disabled={isProcessing}
            selectedId={selectedOption}
          />
        </div>
      )}
      
      {/* Dialog is complete */}
      {dialogEngine && dialogEngine.isComplete() && (
        <div className="dialog-complete p-4 bg-green-50 border-t border-green-200">
          <div className="text-center">
            <p className="text-green-700 font-semibold">Dialog complete!</p>
            <p className="text-sm text-green-600">
              Score: {Math.round(dialogEngine.getScore())}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

DialogInterface.propTypes = {
  dialogEngine: PropTypes.object.isRequired,
  userCharacter: PropTypes.object,
  onDialogComplete: PropTypes.func
};

export default DialogInterface;