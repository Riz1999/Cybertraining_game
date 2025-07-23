import React from 'react';
import PropTypes from 'prop-types';

// Emotional states for victim dialog system
const EMOTIONAL_STATES = {
  NEUTRAL: 'neutral',
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  CONFUSED: 'confused',
  SCARED: 'scared',
  SURPRISED: 'surprised',
  DISTRESSED: 'distressed',
  CALM: 'calm',
  FRUSTRATED: 'frustrated',
  ANXIOUS: 'anxious',
  EMBARRASSED: 'embarrassed',
  WORRIED: 'worried',
  HELPLESS: 'helpless',
  REGRETFUL: 'regretful'
};

/**
 * CharacterAvatar component
 * 
 * This component renders a character avatar with emotional state visualization.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.character - The character data
 * @param {string} props.size - The size of the avatar (sm, md, lg, xl)
 * @param {boolean} props.showName - Whether to show the character name
 * @param {boolean} props.showEmotion - Whether to show the emotional state
 */
const CharacterAvatar = ({ 
  character, 
  size = 'md', 
  showName = true, 
  showEmotion = true 
}) => {
  if (!character) {
    return null;
  }

  // Get the appropriate size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Get the appropriate emotion indicator classes
  const emotionClasses = {
    [EMOTIONAL_STATES.NEUTRAL]: 'bg-gray-400',
    [EMOTIONAL_STATES.HAPPY]: 'bg-green-400',
    [EMOTIONAL_STATES.SAD]: 'bg-blue-400',
    [EMOTIONAL_STATES.ANGRY]: 'bg-red-500',
    [EMOTIONAL_STATES.CONFUSED]: 'bg-yellow-400',
    [EMOTIONAL_STATES.SCARED]: 'bg-purple-400',
    [EMOTIONAL_STATES.SURPRISED]: 'bg-pink-400',
    [EMOTIONAL_STATES.DISTRESSED]: 'bg-red-400',
    [EMOTIONAL_STATES.CALM]: 'bg-teal-400',
    [EMOTIONAL_STATES.FRUSTRATED]: 'bg-orange-500',
    [EMOTIONAL_STATES.ANXIOUS]: 'bg-purple-300',
    [EMOTIONAL_STATES.EMBARRASSED]: 'bg-pink-300',
    [EMOTIONAL_STATES.WORRIED]: 'bg-yellow-500',
    [EMOTIONAL_STATES.HELPLESS]: 'bg-gray-500',
    [EMOTIONAL_STATES.REGRETFUL]: 'bg-blue-500'
  };

  // Get the emotion label
  const emotionLabel = character.emotionalState ? character.emotionalState.charAt(0).toUpperCase() + character.emotionalState.slice(1) : 'Neutral';

  return (
    <div className="character-avatar flex flex-col items-center">
      <div className="relative">
        {/* Avatar image */}
        <div className={`avatar-image rounded-full overflow-hidden ${sizeClasses[size]} border-2 border-gray-300`}>
          {character.avatarUrl ? (
            <img 
              src={character.avatarUrl} 
              alt={character.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {character.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Emotion indicator */}
        {showEmotion && character.emotionalState && (
          <div 
            className={`absolute bottom-0 right-0 rounded-full ${sizeClasses.sm === sizeClasses[size] ? 'w-3 h-3' : 'w-4 h-4'} ${emotionClasses[character.emotionalState] || 'bg-gray-400'}`}
            title={emotionLabel}
          />
        )}
      </div>
      
      {/* Character name */}
      {showName && (
        <div className="character-name mt-1 text-center">
          <span className="text-sm font-medium">{character.name}</span>
          {showEmotion && character.emotionalState && size !== 'sm' && (
            <span className="text-xs block text-gray-500">{emotionLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

CharacterAvatar.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    emotionalState: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showName: PropTypes.bool,
  showEmotion: PropTypes.bool
};

export default CharacterAvatar;