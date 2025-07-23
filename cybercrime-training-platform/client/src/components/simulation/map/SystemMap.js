import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * SystemMap Component
 * 
 * Interactive map showing cybercrime investigation systems (NCRP, I4C, 1930, CCTNS)
 * with clickable elements and information popups.
 */
const SystemMap = ({ 
  systems = [], 
  connections = [], 
  onSystemClick, 
  onKnowledgeCheckComplete,
  className = '' 
}) => {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [visitedSystems, setVisitedSystems] = useState(new Set());
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);

  // Handle system click
  const handleSystemClick = useCallback((system) => {
    setSelectedSystem(system);
    setVisitedSystems(prev => new Set([...prev, system.id]));
    
    if (onSystemClick) {
      onSystemClick(system);
    }
  }, [onSystemClick]);

  // Close popup
  const closePopup = useCallback(() => {
    setSelectedSystem(null);
  }, []);

  // Check if all systems have been visited
  const allSystemsVisited = systems.length > 0 && visitedSystems.size === systems.length;

  // Start knowledge check when all systems are visited
  React.useEffect(() => {
    if (allSystemsVisited && !showKnowledgeCheck) {
      setTimeout(() => {
        setShowKnowledgeCheck(true);
      }, 1000);
    }
  }, [allSystemsVisited, showKnowledgeCheck]);

  // Knowledge check questions
  const knowledgeCheckQuestions = [
    {
      id: 'q1',
      question: 'Which system is the primary portal for reporting cybercrimes in India?',
      options: ['NCRP', 'I4C', '1930 Helpline', 'CCTNS'],
      correct: 'NCRP'
    },
    {
      id: 'q2',
      question: 'What does I4C stand for?',
      options: [
        'Indian Internet Crime Center',
        'Indian Cyber Crime Coordination Centre',
        'International Cyber Crime Council',
        'Indian Computer Crime Commission'
      ],
      correct: 'Indian Cyber Crime Coordination Centre'
    },
    {
      id: 'q3',
      question: 'Which number should victims call for immediate cybercrime assistance?',
      options: ['100', '1930', '1091', '181'],
      correct: '1930'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < knowledgeCheckQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      // Calculate score and complete
      const correctAnswers = knowledgeCheckQuestions.filter(q => 
        answers[q.id] === q.correct
      ).length;
      const score = (correctAnswers / knowledgeCheckQuestions.length) * 100;
      
      if (onKnowledgeCheckComplete) {
        onKnowledgeCheckComplete({
          score,
          totalQuestions: knowledgeCheckQuestions.length,
          correctAnswers,
          answers
        });
      }
    }
  };

  return (
    <div className={`system-map-container ${className}`}>
      <div className="system-map bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 relative min-h-96">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Cybercrime Investigation Systems Map
        </h3>
        
        {/* Progress indicator */}
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-600">
            Systems Explored: {visitedSystems.size} / {systems.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(visitedSystems.size / systems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* SVG Map */}
        <svg 
          viewBox="0 0 600 400" 
          className="w-full h-80 border border-gray-200 rounded bg-white"
        >
          {/* Render connections */}
          {connections.map((connection, index) => {
            const fromSystem = systems.find(s => s.id === connection.from);
            const toSystem = systems.find(s => s.id === connection.to);
            
            if (!fromSystem || !toSystem) return null;
            
            // Provide default positions if missing
            const fromPosition = fromSystem.position || { x: 100, y: 100 };
            const toPosition = toSystem.position || { x: 200, y: 200 };
            
            return (
              <line
                key={index}
                x1={fromPosition.x}
                y1={fromPosition.y}
                x2={toPosition.x}
                y2={toPosition.y}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-60"
              />
            );
          })}

          {/* Render systems */}
          {systems.map((system) => {
            const isVisited = visitedSystems.has(system.id);
            const isSelected = selectedSystem?.id === system.id;
            
            // Provide default position if missing
            const position = system.position || { x: 100, y: 100 };
            
            return (
              <g key={system.id}>
                {/* System circle */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="30"
                  fill={isVisited ? '#3b82f6' : '#e2e8f0'}
                  stroke={isSelected ? '#1d4ed8' : '#64748b'}
                  strokeWidth={isSelected ? '3' : '2'}
                  className="cursor-pointer hover:fill-blue-500 transition-all duration-200"
                  onClick={() => handleSystemClick(system)}
                />
                
                {/* System label */}
                <text
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-white cursor-pointer"
                  onClick={() => handleSystemClick(system)}
                >
                  {system.name}
                </text>
                
                {/* Visited indicator */}
                {isVisited && (
                  <circle
                    cx={position.x + 20}
                    cy={position.y - 20}
                    r="8"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* System Information Popup */}
        {selectedSystem && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-gray-800">
                  {selectedSystem.name}
                </h4>
                <button
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-gray-700">Description:</h5>
                  <p className="text-gray-600">{selectedSystem.description || 'No description available'}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-700">Details:</h5>
                  <p className="text-gray-600">{selectedSystem.details || 'No details available'}</p>
                </div>
                
                {selectedSystem.keyFeatures && (
                  <div>
                    <h5 className="font-semibold text-gray-700">Key Features:</h5>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      {selectedSystem.keyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                onClick={closePopup}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}

        {/* Knowledge Check Modal */}
        {showKnowledgeCheck && !showResults && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg p-6 max-w-lg mx-4 shadow-xl">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Knowledge Check ({currentQuestion + 1}/{knowledgeCheckQuestions.length})
              </h4>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-4">
                  {knowledgeCheckQuestions[currentQuestion].question}
                </p>
                
                <div className="space-y-2">
                  {knowledgeCheckQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(knowledgeCheckQuestions[currentQuestion].id, option)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        answers[knowledgeCheckQuestions[currentQuestion].id] === option
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={!answers[knowledgeCheckQuestions[currentQuestion].id]}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestion < knowledgeCheckQuestions.length - 1 ? 'Next Question' : 'Complete'}
              </button>
            </div>
          </div>
        )}

        {/* Results Modal */}
        {showResults && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Knowledge Check Complete!
              </h4>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((Object.values(answers).filter((answer, index) => 
                    answer === knowledgeCheckQuestions[index].correct
                  ).length / knowledgeCheckQuestions.length) * 100)}%
                </div>
                <p className="text-gray-600">
                  You got {Object.values(answers).filter((answer, index) => 
                    answer === knowledgeCheckQuestions[index].correct
                  ).length} out of {knowledgeCheckQuestions.length} questions correct!
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-green-600 font-semibold mb-2">
                  🎉 System Map Exploration Complete!
                </div>
                <p className="text-sm text-gray-600">
                  You have successfully explored all cybercrime investigation systems.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SystemMap.propTypes = {
  systems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    details: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    keyFeatures: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  connections: PropTypes.arrayOf(PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  })),
  onSystemClick: PropTypes.func,
  onKnowledgeCheckComplete: PropTypes.func,
  className: PropTypes.string
};

export default SystemMap;