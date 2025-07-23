import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from './CharacterAvatar';

/**
 * DialogHistory component
 * 
 * This component displays a condensed history of dialog interactions.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dialogEngine - The dialog engine instance
 * @param {string} props.className - Additional CSS classes
 */
const DialogHistory = ({ dialogEngine, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!dialogEngine) {
    return null;
  }
  
  // Get dialog history from the dialog engine
  const history = dialogEngine.getState()?.history || [];
  
  // If there's no history, don't render anything
  if (history.length === 0) {
    return null;
  }
  
  // Toggle history expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get node and option details
  const getInteractionDetails = (nodeId, optionId) => {
    const node = dialogEngine.getDialogTree().getNode(nodeId);
    
    if (!node) {
      return { participant: null, text: 'Unknown interaction' };
    }
    
    const participant = dialogEngine.getDialogTree().getParticipant(node.participantId);
    
    // If there's an option ID, get the option text
    if (optionId) {
      const option = node.options.find(opt => opt.id === optionId);
      
      if (option) {
        return {
          participant: null, // User response doesn't have a participant
          text: option.text,
          isUser: true
        };
      }
    }
    
    // Otherwise, return the node message
    return {
      participant,
      text: node.message?.content || 'No message',
      isUser: false
    };
  };
  
  return (
    <div className={`dialog-history border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* History header */}
      <div 
        className="history-header bg-gray-100 p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleExpansion}
      >
        <h4 className="text-sm font-medium text-gray-700">
          Conversation History ({history.length} interactions)
        </h4>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? '▲ Hide' : '▼ Show'}
        </button>
      </div>
      
      {/* History content */}
      {isExpanded && (
        <div className="history-content bg-white p-3 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {history.map((item, index) => {
              const { participant, text, isUser } = getInteractionDetails(item.nodeId, item.optionId);
              
              return (
                <div 
                  key={`history-${index}`}
                  className={`history-item flex items-start p-2 rounded ${
                    isUser ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  {/* Avatar or indicator */}
                  <div className="flex-shrink-0 mr-2">
                    {isUser ? (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-500">
                        You
                      </div>
                    ) : (
                      participant && (
                        <CharacterAvatar
                          character={participant}
                          size="sm"
                          showName={false}
                          showEmotion={false}
                        />
                      )
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    {/* Speaker name */}
                    <div className="text-xs text-gray-500 mb-1">
                      {isUser ? 'You' : (participant?.name || 'Unknown')}
                      <span className="mx-1">•</span>
                      {item.timestamp && formatTime(item.timestamp)}
                    </div>
                    
                    {/* Message text */}
                    <div className="text-sm text-gray-700">
                      {text.length > 100 ? `${text.substring(0, 100)}...` : text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

DialogHistory.propTypes = {
  dialogEngine: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default DialogHistory;