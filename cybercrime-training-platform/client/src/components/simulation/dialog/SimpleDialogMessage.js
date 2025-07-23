import React from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from './CharacterAvatar';

/**
 * SimpleDialogMessage component
 * 
 * This is a simplified version of the DialogMessage component that works with our dialog system.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - The message data
 * @param {Object} props.participant - The participant data
 * @param {boolean} props.isUser - Whether the message is from the user
 */
const SimpleDialogMessage = ({
  message,
  participant,
  isUser = false
}) => {
  if (!message || !message.content) {
    return null;
  }
  
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
            <div className="message-text">
              {message.content}
            </div>
            
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

SimpleDialogMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }).isRequired,
  participant: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    emotionalState: PropTypes.string
  }),
  isUser: PropTypes.bool
};

export default SimpleDialogMessage;