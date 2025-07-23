import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CharacterAvatar from '../simulation/dialog/CharacterAvatar';

/**
 * Suspect Interrogation Dialog Component
 * 
 * This component simulates an interrogation dialog with a suspect,
 * allowing the user to choose different approaches and responses.
 */
const SuspectInterrogationDialog = ({ interrogationData, onComplete }) => {
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [dialogHistory, setDialogHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [processingResponse, setProcessingResponse] = useState(false);

  // Initialize with the first interaction
  useEffect(() => {
    if (interrogationData && interrogationData.interactions) {
      const firstInteraction = interrogationData.interactions.find(
        interaction => interaction.id === 'intro'
      );
      if (firstInteraction) {
        setCurrentInteraction(firstInteraction);
        addToDialogHistory(firstInteraction);
      }
    }
  }, [interrogationData]);

  const getCharacterById = (characterId) => {
    return interrogationData.characters.find(char => char.id === characterId);
  };

  const getInteractionById = (interactionId) => {
    return interrogationData.interactions.find(
      interaction => interaction.id === interactionId
    );
  };

  const addToDialogHistory = (interaction) => {
    // For dialog interactions, add to history
    if (interaction.type === 'dialog') {
      const character = getCharacterById(interaction.character);
      setDialogHistory(prevHistory => [
        ...prevHistory,
        {
          id: interaction.id,
          character,
          text: interaction.text,
          options: interaction.options
        }
      ]);
    }
  };

  const handleOptionSelect = (option) => {
    // Prevent multiple clicks while processing a response
    if (processingResponse) {
      return;
    }
    
    // Set processing flag to prevent multiple clicks
    setProcessingResponse(true);
    
    // Add points if available
    if (option.points) {
      setTotalPoints(prevPoints => prevPoints + option.points);
    }

    // Add feedback to dialog history if available
    if (option.feedback) {
      setDialogHistory(prevHistory => [
        ...prevHistory,
        {
          id: `feedback-${option.id}`,
          isFeedback: true,
          text: option.feedback
        }
      ]);
    }

    // Get next interaction
    const nextInteraction = getInteractionById(option.nextInteractionId);
    
    if (nextInteraction) {
      // If it's a result type, show the result
      if (nextInteraction.type === 'result') {
        setResult(nextInteraction.result);
        setCompleted(true);
        
        // Call onComplete with the final score
        if (onComplete) {
          onComplete(nextInteraction.result.score);
        }
        
        // Reset processing flag
        setProcessingResponse(false);
      } else {
        // Otherwise, continue the dialog
        setTimeout(() => {
          setCurrentInteraction(nextInteraction);
          addToDialogHistory(nextInteraction);
          setProcessingResponse(false); // Reset processing flag after dialog updates
        }, 500); // Small delay to prevent accidental double clicks
      }
    } else {
      // Reset processing flag if no next interaction
      setProcessingResponse(false);
    }
  };

  if (!interrogationData) {
    return <div>Loading interrogation data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{interrogationData.title}</h2>
        <p className="text-gray-600 mt-2">{interrogationData.description}</p>
      </div>

      {/* Scenario information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">{interrogationData.scenario.title}</h3>
        <p className="text-blue-700 mb-2">{interrogationData.scenario.description}</p>
        <p className="text-sm text-blue-600">{interrogationData.scenario.context}</p>
      </div>

      {/* Dialog history */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
        {dialogHistory.map((dialog, index) => (
          <div 
            key={`${dialog.id}-${index}`} 
            className={`mb-4 ${dialog.isFeedback ? 'pl-12' : ''}`}
          >
            {dialog.isFeedback ? (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm italic text-blue-700">{dialog.text}</p>
              </div>
            ) : (
              <div className="flex items-start">
                {dialog.character && (
                  <div className="mr-3 mt-1">
                    <CharacterAvatar 
                      character={dialog.character} 
                      size="md" 
                      showName={false}
                    />
                  </div>
                )}
                <div className="flex-1">
                  {dialog.character && (
                    <p className="font-medium text-gray-800 mb-1">
                      {dialog.character.name}
                    </p>
                  )}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-800">{dialog.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Response options */}
      {!completed && currentInteraction && currentInteraction.options && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Your Response:</h3>
          <div className="space-y-3">
            {currentInteraction.options.map(option => (
              <div
                key={option.id}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors"
                onClick={() => handleOptionSelect(option)}
              >
                <p className="text-gray-800">{option.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result display */}
      {completed && result && (
        <div className={`bg-${result.score >= 70 ? 'green' : 'amber'}-50 border border-${result.score >= 70 ? 'green' : 'amber'}-200 rounded-lg p-6`}>
          <h3 className={`text-xl font-semibold text-${result.score >= 70 ? 'green' : 'amber'}-800 mb-3`}>
            {result.title}
          </h3>
          <p className={`text-${result.score >= 70 ? 'green' : 'amber'}-700 mb-4`}>
            {result.description}
          </p>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <span className="font-medium">Final Score:</span>
            <span className="text-xl font-bold">{result.score}/100</span>
          </div>
        </div>
      )}

      {/* Points display */}
      <div className="flex justify-end mt-4">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="font-medium">Points: </span>
          <span className={`font-bold ${totalPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPoints}
          </span>
        </div>
      </div>
    </div>
  );
};

SuspectInterrogationDialog.propTypes = {
  interrogationData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    scenario: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      context: PropTypes.string.isRequired
    }).isRequired,
    characters: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        description: PropTypes.string,
        avatarUrl: PropTypes.string,
        emotionalState: PropTypes.string
      })
    ).isRequired,
    interactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        character: PropTypes.string,
        text: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            points: PropTypes.number,
            feedback: PropTypes.string,
            nextInteractionId: PropTypes.string
          })
        )
      })
    ).isRequired
  }).isRequired,
  onComplete: PropTypes.func
};

export default SuspectInterrogationDialog;