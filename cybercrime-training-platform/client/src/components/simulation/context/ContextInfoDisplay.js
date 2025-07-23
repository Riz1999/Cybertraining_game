import React from 'react';
import PropTypes from 'prop-types';

/**
 * ContextInfoDisplay Component
 * 
 * Displays contextual information about a case or scenario.
 * Used in the complaint delay scenario system.
 */
const ContextInfoDisplay = ({ scenario, activeEvent }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Case Information</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Case Details</h4>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Case ID:</div>
              <div className="font-medium text-gray-900">{scenario.title}</div>
              
              <div className="text-gray-500">Type:</div>
              <div className="font-medium text-gray-900">Cybercrime - Financial Fraud</div>
              
              <div className="text-gray-500">Status:</div>
              <div className="font-medium text-gray-900">Under Investigation</div>
              
              <div className="text-gray-500">Filed On:</div>
              <div className="font-medium text-gray-900">
                {new Date(scenario.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Case Summary</h4>
          <p className="text-gray-700 text-sm">{scenario.description}</p>
          <p className="text-gray-700 text-sm mt-2">{scenario.context}</p>
        </div>

        {scenario.characters && scenario.characters.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Involved Parties</h4>
            <div className="space-y-3">
              {scenario.characters.map(character => (
                <div key={character.id} className="flex items-start">
                  {character.avatarUrl && (
                    <div className="flex-shrink-0 mr-3">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={character.avatarUrl}
                        alt={character.name}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{character.name}</div>
                    <div className="text-sm text-gray-500">{character.role}</div>
                    <div className="text-xs text-gray-500 mt-1">{character.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeEvent && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Current Event</h4>
            <div className={`rounded-md p-3 ${
              activeEvent.type === 'critical' 
                ? 'bg-red-50 text-red-700' 
                : activeEvent.type === 'decision' 
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-blue-50 text-blue-700'
            }`}>
              <div className="font-medium">{activeEvent.title}</div>
              <div className="text-sm mt-1">{activeEvent.description}</div>
              <div className="text-xs mt-2">
                {new Date(activeEvent.timestamp).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ContextInfoDisplay.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    context: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    characters: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        description: PropTypes.string,
        avatarUrl: PropTypes.string
      })
    )
  }).isRequired,
  activeEvent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    type: PropTypes.string
  })
};

export default ContextInfoDisplay;