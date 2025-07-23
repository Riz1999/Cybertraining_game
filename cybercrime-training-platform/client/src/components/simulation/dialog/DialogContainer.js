import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from './CharacterAvatar';
import DialogOptions from './DialogOptions';
import DialogHistory from './DialogHistory';
import AudioPlayer from './AudioPlayer';
import { INTERACTION_TYPES } from '../../../simulation/models/SimulationTypes';

/**
 * DialogContainer component
 * 
 * This component renders a dialog-based simulation with character avatars,
 * dialog options, and dialog history.
 */
const DialogContainer = ({
  simulation,
  currentInteraction,
  onOptionSelected,
  dialogHistory = [],
  characters = []
}) => {
  const [showOptions, setShowOptions] = useState(true);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const containerRef = useRef(null);
  
  // Get the current character speaking
  const currentCharacter = currentInteraction?.metadata?.characterId
    ? characters.find(char => char.id === currentInteraction.metadata.characterId)
    : null;
  
  // Check if the current interaction has audio
  useEffect(() => {
    if (currentInteraction?.metadata?.audioUrl) {
      setAudioUrl(currentInteraction.metadata.audioUrl);
    } else {
      setAudioUrl(null);
    }
  }, [currentInteraction]);
  
  // Typing effect for character dialog
  useEffect(() => {
    if (!currentInteraction) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    const text = currentInteraction.prompt;
    let index = 0;
    const typingSpeed = 30; // milliseconds per character
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [currentInteraction]);
  
  // Scroll to bottom when new dialog is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [dialogHistory, displayedText]);
  
  // Handle option selection
  const handleOptionSelected = (option) => {
    setShowOptions(false);
    onOptionSelected(option);
    
    // Show options again after a delay
    setTimeout(() => {
      setShowOptions(true);
    }, 1000);
  };
  
  // Skip typing animation
  const handleSkipTyping = () => {
    if (isTyping && currentInteraction) {
      setIsTyping(false);
      setDisplayedText(currentInteraction.prompt);
    }
  };
  
  if (!currentInteraction) {
    return (
      <div className="dialog-container p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-500">No active dialog</p>
      </div>
    );
  }
  
  return (
    <div className="dialog-container bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Character information and avatar */}
      {currentCharacter && (
        <div className="character-header bg-gray-100 p-4 flex items-center">
          <CharacterAvatar 
            character={currentCharacter} 
            size="md" 
            className="mr-4"
          />
          <div>
            <h3 className="font-bold text-lg">{currentCharacter.name}</h3>
            <p className="text-sm text-gray-600">{currentCharacter.role}</p>
          </div>
        </div>
      )}
      
      {/* Dialog history */}
      <div 
        ref={containerRef}
        className="dialog-history-container p-4 h-64 overflow-y-auto"
      >
        <DialogHistory 
          dialogHistory={dialogHistory} 
          characters={characters}
        />
        
        {/* Current dialog */}
        {currentInteraction && (
          <div className="current-dialog mt-4">
            {currentCharacter && (
              <div className="flex items-start mb-2">
                <CharacterAvatar 
                  character={currentCharacter} 
                  size="sm" 
                  className="mr-2 flex-shrink-0"
                />
                <div 
                  className="dialog-bubble bg-blue-100 p-3 rounded-lg relative"
                  onClick={handleSkipTyping}
                >
                  <p>{displayedText}</p>
                  {isTyping && (
                    <span className="typing-indicator">...</span>
                  )}
                </div>
              </div>
            )}
            
            {!currentCharacter && (
              <div 
                className="narrator-text p-3 italic text-gray-700"
                onClick={handleSkipTyping}
              >
                {displayedText}
                {isTyping && (
                  <span className="typing-indicator">...</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Audio player */}
      {audioUrl && (
        <div className="audio-container p-4 bg-gray-50 border-t border-gray-200">
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}
      
      {/* Dialog options */}
      {currentInteraction.type === INTERACTION_TYPES.MULTIPLE_CHOICE && showOptions && !isTyping && (
        <div className="dialog-options-container p-4 bg-gray-50 border-t border-gray-200">
          <DialogOptions 
            options={currentInteraction.options} 
            onOptionSelected={handleOptionSelected}
          />
        </div>
      )}
      
      {/* Text input for free text responses */}
      {currentInteraction.type === INTERACTION_TYPES.TEXT_RESPONSE && showOptions && !isTyping && (
        <div className="text-input-container p-4 bg-gray-50 border-t border-gray-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.textResponse;
              handleOptionSelected(input.value);
              input.value = '';
            }}
            className="flex"
          >
            <input 
              type="text" 
              name="textResponse"
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your response..."
              required
            />
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

DialogContainer.propTypes = {
  simulation: PropTypes.object.isRequired,
  currentInteraction: PropTypes.object,
  onOptionSelected: PropTypes.func.isRequired,
  dialogHistory: PropTypes.array,
  characters: PropTypes.array
};

export default DialogContainer;