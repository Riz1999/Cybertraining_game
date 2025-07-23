import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SimpleDialogMessage from './SimpleDialogMessage';
import ResponseOptions from './ResponseOptions';
import CharacterAvatar from './CharacterAvatar';
import AudioPlayer from './AudioPlayer';
import DialogHistory from './DialogHistory';
import { MESSAGE_TYPES, PARTICIPANT_TYPES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * EnhancedDialogContainer component
 * 
 * This component provides an enhanced dialog interface with audio support,
 * character avatars, and improved user experience features.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dialogEngine - The dialog engine instance
 * @param {Object} props.userCharacter - The user character data
 * @param {boolean} props.audioEnabled - Whether audio is enabled
 * @param {boolean} props.showHistory - Whether to show dialog history
 * @param {Function} props.onDialogComplete - Callback when dialog is complete
 */
const EnhancedDialogContainer = ({
  dialogEngine,
  userCharacter,
  audioEnabled = true,
  showHistory = false,
  onDialogComplete
}) => {
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize the dialog engine
  useEffect(() => {
    if (!dialogEngine) return;

    // Set up event listeners
    const onDialogStart = () => {
      setMessages([]);
      setCurrentNode(null);
      setSelectedOption(null);
      setCurrentCharacter(null);
      setIsProcessing(false);
    };

    const onDialogNode = (data) => {
      const { node } = data;
      setCurrentNode(node);
      
      // Get the character for this node
      const participant = dialogEngine.getDialogTree().getParticipant(node.participantId);
      setCurrentCharacter(participant);
      
      // Add typing effect for character messages
      if (participant && participant.type === PARTICIPANT_TYPES.CHARACTER) {
        setIsTyping(true);
        
        // Simulate typing delay
        setTimeout(() => {
          setIsTyping(false);
          addMessage(node, participant);
        }, 1000 + Math.random() * 1000); // Random typing delay
      } else {
        addMessage(node, participant);
      }
    };

    const onDialogOptionSelected = (data) => {
      setIsProcessing(true);
      setSelectedOption(data.optionId);
      
      // Add user response to messages
      const option = currentNode?.options?.find(opt => opt.id === data.optionId);
      if (option) {
        addUserMessage(option.text);
      }
    };

    const onDialogComplete = (data) => {
      setIsProcessing(false);
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

    // Clean up event listeners on unmount
    return () => {
      dialogEngine.events.off('dialog:start', onDialogStart);
      dialogEngine.events.off('dialog:node', onDialogNode);
      dialogEngine.events.off('dialog:option:selected', onDialogOptionSelected);
      dialogEngine.events.off('dialog:option:selected:complete', () => setIsProcessing(false));
      dialogEngine.events.off('dialog:complete', onDialogComplete);
    };
  }, [dialogEngine, currentNode, onDialogComplete]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Add a message to the conversation
  const addMessage = (node, participant) => {
    if (!node.message || !node.message.content) return;
    
    const message = {
      id: node.id,
      content: node.message.content,
      type: node.message.type || MESSAGE_TYPES.TEXT,
      participant: participant,
      timestamp: new Date(),
      audioUrl: node.message.audioUrl,
      isUser: false
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Add a user message to the conversation
  const addUserMessage = (text) => {
    const message = {
      id: `user-${Date.now()}`,
      content: text,
      type: MESSAGE_TYPES.TEXT,
      participant: userCharacter,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isProcessing) return;
    
    dialogEngine.selectOption(option.id);
  };

  // Handle audio playback
  const handleAudioPlay = (messageId, audioUrl) => {
    if (!audioEnabled || !audioUrl) return;
    
    setAudioPlaying(messageId);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioPlaying(null);
      });
    }
  };

  // Handle audio end
  const handleAudioEnd = () => {
    setAudioPlaying(null);
  };

  // Handle audio error
  const handleAudioError = (error) => {
    console.error('Audio error:', error);
    setAudioPlaying(null);
  };

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (!isTyping || !currentCharacter) return null;
    
    return (
      <div className="typing-indicator flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-4">
        <CharacterAvatar 
          character={currentCharacter} 
          size="sm" 
          showName={false} 
        />
        <div className="typing-dots flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="text-sm text-gray-500">{currentCharacter.name} is typing...</span>
      </div>
    );
  };

  // Render the dialog container
  return (
    <div className="enhanced-dialog-container bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Dialog header */}
      <div className="dialog-header bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {dialogEngine?.getDialogTree()?.title || 'Dialog Simulation'}
            </h3>
            <p className="text-sm text-gray-600">
              {dialogEngine?.getDialogTree()?.description || 'Interactive conversation simulation'}
            </p>
          </div>
          
          {/* Current character indicator */}
          {currentCharacter && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Speaking with:</span>
              <CharacterAvatar 
                character={currentCharacter} 
                size="sm" 
                showName={true} 
                showEmotion={true}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Dialog messages */}
      <div className="dialog-messages flex-grow p-4 overflow-y-auto bg-gray-50">
        {/* Start button when no messages */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600 mb-4">Click the button below to start the conversation</p>
            <button
              onClick={() => dialogEngine.start()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Conversation
            </button>
          </div>
        )}
        
        {/* Show dialog history if enabled */}
        {showHistory && messages.length > 0 && (
          <DialogHistory 
            dialogEngine={dialogEngine}
            className="mb-4"
          />
        )}
        
        {/* Messages */}
        {messages.map((message) => (
          <SimpleDialogMessage
            key={message.id}
            message={message}
            participant={message.participant}
            isUser={message.isUser}
          />
        ))}
        
        {/* Typing indicator */}
        {renderTypingIndicator()}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Response options */}
      {currentNode && currentNode.options && currentNode.options.length > 0 && !isTyping && (
        <div className="dialog-response p-4 bg-white border-t border-gray-200">
          {/* User avatar and prompt */}
          {userCharacter && (
            <div className="flex items-center mb-3">
              <CharacterAvatar 
                character={userCharacter} 
                size="sm" 
                showName={true} 
              />
              <span className="ml-2 text-sm text-gray-600">Choose your response:</span>
            </div>
          )}
          
          {/* Response options */}
          <ResponseOptions 
            options={currentNode.options} 
            onSelect={handleOptionSelect} 
            disabled={isProcessing}
            selectedId={selectedOption}
          />
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Processing response...
            </div>
          )}
        </div>
      )}
      
      {/* Dialog completion */}
      {dialogEngine && dialogEngine.isComplete() && (
        <div className="dialog-complete p-4 bg-green-50 border-t border-green-200">
          <div className="text-center">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <p className="text-green-800 font-semibold mb-1">Conversation Complete!</p>
            <p className="text-sm text-green-700">
              Final Score: {Math.round(dialogEngine.getScore())} / 100
            </p>
            
            {/* Communication metrics summary */}
            <div className="mt-3 flex justify-center space-x-4 text-xs text-green-600">
              {Object.entries(dialogEngine.getMetrics()).map(([metric, value]) => (
                <div key={metric} className="text-center">
                  <div className="font-semibold">{Math.round(value)}</div>
                  <div className="capitalize">{metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden audio element */}
      {audioEnabled && (
        <audio
          ref={audioRef}
          onEnded={handleAudioEnd}
          onError={handleAudioError}
          preload="none"
        />
      )}
    </div>
  );
};

EnhancedDialogContainer.propTypes = {
  dialogEngine: PropTypes.object.isRequired,
  userCharacter: PropTypes.object,
  audioEnabled: PropTypes.bool,
  showHistory: PropTypes.bool,
  onDialogComplete: PropTypes.func
};

export default EnhancedDialogContainer;