import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from './CharacterAvatar';
import { MESSAGE_TYPES } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * DialogMessage component
 * 
 * This component renders a message in a dialog conversation.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - The message data
 * @param {Object} props.participant - The participant data
 * @param {boolean} props.isUser - Whether the message is from the user
 * @param {boolean} props.audioEnabled - Whether audio is enabled
 * @param {boolean} props.isAudioPlaying - Whether audio is currently playing
 * @param {Function} props.onAudioPlay - Callback when audio is played
 * @param {Function} props.onAudioEnd - Callback when audio ends
 */
const DialogMessage = ({
  message,
  participant,
  isUser = false,
  audioEnabled = true,
  isAudioPlaying = false,
  onAudioPlay,
  onAudioEnd
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (!message) {
    return null;
  }
  
  // Determine if the message has audio
  const hasAudio = (message.type === MESSAGE_TYPES.AUDIO || 
                    message.type === MESSAGE_TYPES.TEXT_WITH_AUDIO) && 
                    message.audioUrl;
  
  // Toggle message expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle audio play button click
  const handleAudioPlay = () => {
    if (onAudioPlay && hasAudio && audioEnabled) {
      onAudioPlay(message.id, message.audioUrl);
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`dialog-message mb-4 ${isUser ? 'user-message' : 'character-message'}`}>
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`message-container max-w-3/4 ${isUser ? 'order-2' : 'order-1'}`}>
          {/* Message bubble */}
          <div className={`message-bubble rounded-lg p-3 shadow-sm ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-bl-none'
          }`}>
            {/* Message content */}
            {(message.type === MESSAGE_TYPES.TEXT || 
              message.type === MESSAGE_TYPES.TEXT_WITH_AUDIO) && (
              <div className="message-text">
                {isExpanded ? message.content : `${message.content.substring(0, 100)}...`}
                
                {/* Show expand/collapse button for long messages */}
                {message.content && message.content.length > 150 && (
                  <button
                    onClick={toggleExpansion}
                    className={`text-xs ml-1 ${isUser ? 'text-blue-200' : 'text-blue-500'}`}
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
            
            {/* Audio controls */}
            {hasAudio && audioEnabled && (
              <div className={`audio-controls mt-2 flex items-center ${
                isUser ? 'justify-end' : 'justify-start'
              }`}>
                <button
                  onClick={handleAudioPlay}
                  disabled={isAudioPlaying}
                  className={`flex items-center text-xs px-2 py-1 rounded ${
                    isUser 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isAudioPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAudioPlaying ? (
                    <>
                      <span className="mr-1">▶</span> Playing...
                    </>
                  ) : (
                    <>
                      <span className="mr-1">▶</span> Play Audio
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Message timestamp */}
            <div className={`message-time text-xs mt-1 ${
              isUser ? 'text-blue-200 text-right' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
        
        {/* Avatar */}
        <div className={`avatar-container mx-2 ${isUser ? 'order-1' : 'order-2'}`}>
          {participant && (
            <CharacterAvatar
              character={participant}
              size="sm"
              showName={false}
              showEmotion={!isUser}
            />
          )}
        </div>
      </div>
      
      {/* Participant name */}
      <div className={`participant-name text-xs mt-1 ${
        isUser ? 'text-right mr-12' : 'ml-12'
      }`}>
        <span className="text-gray-500">
          {participant ? participant.name : (isUser ? 'You' : 'Unknown')}
        </span>
      </div>
    </div>
  );
};

DialogMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    type: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    audioUrl: PropTypes.string
  }).isRequired,
  participant: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    emotionalState: PropTypes.string
  }),
  isUser: PropTypes.bool,
  audioEnabled: PropTypes.bool,
  isAudioPlaying: PropTypes.bool,
  onAudioPlay: PropTypes.func,
  onAudioEnd: PropTypes.func
};

export default DialogMessage;