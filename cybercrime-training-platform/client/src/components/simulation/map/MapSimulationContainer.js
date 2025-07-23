import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SystemMap from './SystemMap';

/**
 * MapSimulationContainer Component
 * 
 * Container component that manages the state and logic for map-based simulations.
 * Handles scoring, progress tracking, and completion logic.
 */
const MapSimulationContainer = ({ 
  simulation, 
  onComplete, 
  onProgress,
  className = '' 
}) => {
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [systemInteractions, setSystemInteractions] = useState([]);

  // Extract map data from simulation
  const mapData = simulation?.scenario?.metadata?.mapData || {
    systems: [],
    connections: []
  };

  // Handle system click interactions
  const handleSystemClick = useCallback((system) => {
    const interaction = {
      systemId: system.id,
      timestamp: Date.now(),
      type: 'system_click'
    };

    setSystemInteractions(prev => [...prev, interaction]);

    // Award points for exploring systems
    const explorationPoints = 10;
    setScore(prev => prev + explorationPoints);

    if (onProgress) {
      onProgress({
        type: 'system_explored',
        systemId: system.id,
        points: explorationPoints,
        totalScore: score + explorationPoints
      });
    }
  }, [score, onProgress]);

  // Handle knowledge check completion
  const handleKnowledgeCheckComplete = useCallback((results) => {
    const knowledgePoints = Math.round((results.score / 100) * 50); // Max 50 points for knowledge check
    const totalScore = score + knowledgePoints;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    setScore(totalScore);
    setIsCompleted(true);

    const completionData = {
      score: totalScore,
      maxScore: 100, // 40 points for exploration + 50 points for knowledge check + 10 bonus
      timeSpent,
      systemInteractions,
      knowledgeCheckResults: results,
      completedAt: new Date()
    };

    if (onComplete) {
      onComplete(completionData);
    }
  }, [score, startTime, systemInteractions, onComplete]);

  // Default system data if not provided in simulation
  const defaultSystems = [
    {
      id: 'ncrp',
      name: 'NCRP',
      description: 'National Cybercrime Reporting Portal',
      details: 'The primary portal for reporting cybercrimes in India. Citizens can file complaints online, track their status, and receive updates on investigations.',
      position: { x: 150, y: 120 },
      keyFeatures: [
        'Online complaint filing',
        'Case status tracking',
        'Digital evidence submission',
        'Multi-language support'
      ]
    },
    {
      id: 'i4c',
      name: 'I4C',
      description: 'Indian Cyber Crime Coordination Centre',
      details: 'Coordinates cybercrime investigation across states and provides technical support to law enforcement agencies.',
      position: { x: 450, y: 120 },
      keyFeatures: [
        'Inter-state coordination',
        'Technical expertise',
        'Training programs',
        'Policy development'
      ]
    },
    {
      id: 'helpline-1930',
      name: '1930',
      description: 'National Cybercrime Helpline',
      details: 'Immediate assistance for cybercrime victims. Available 24/7 for reporting and getting guidance on cybercrime incidents.',
      position: { x: 300, y: 250 },
      keyFeatures: [
        '24/7 availability',
        'Immediate response',
        'Victim counseling',
        'Emergency assistance'
      ]
    },
    {
      id: 'cctns',
      name: 'CCTNS',
      description: 'Crime and Criminal Tracking Network & Systems',
      details: 'Comprehensive crime tracking system that maintains records of crimes, criminals, and investigation progress across the country.',
      position: { x: 150, y: 300 },
      keyFeatures: [
        'Crime database',
        'Criminal records',
        'Investigation tracking',
        'Inter-agency sharing'
      ]
    }
  ];

  const defaultConnections = [
    { from: 'ncrp', to: 'i4c' },
    { from: 'ncrp', to: 'helpline-1930' },
    { from: 'i4c', to: 'cctns' },
    { from: 'helpline-1930', to: 'cctns' }
  ];

  const systems = mapData.systems.length > 0 ? mapData.systems : defaultSystems;
  const connections = mapData.connections.length > 0 ? mapData.connections : defaultConnections;

  return (
    <div className={`map-simulation-container ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {simulation?.title || 'Cybercrime Systems Map Exploration'}
        </h2>
        <p className="text-gray-600 mb-4">
          {simulation?.description || 'Explore the interconnected systems used in cybercrime investigation. Click on each system to learn more about its role and functions.'}
        </p>
        
        {/* Score and Progress */}
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
          <div className="flex space-x-6">
            <div>
              <span className="text-sm text-gray-600">Current Score:</span>
              <span className="ml-2 font-semibold text-blue-600">{score} points</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Systems Explored:</span>
              <span className="ml-2 font-semibold text-green-600">
                {new Set(systemInteractions.map(i => i.systemId)).size} / {systems.length}
              </span>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Completed!</span>
            </div>
          )}
        </div>
      </div>

      {/* System Map */}
      <SystemMap
        systems={systems}
        connections={connections}
        onSystemClick={handleSystemClick}
        onKnowledgeCheckComplete={handleKnowledgeCheckComplete}
        className="shadow-lg"
      />

      {/* Instructions */}
      {!isCompleted && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click on each system circle to learn about its role in cybercrime investigation</li>
            <li>• Explore all systems to unlock the knowledge check</li>
            <li>• Complete the knowledge check to finish this activity</li>
            <li>• Pay attention to the connections between systems</li>
          </ul>
        </div>
      )}
    </div>
  );
};

MapSimulationContainer.propTypes = {
  simulation: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    scenario: PropTypes.shape({
      metadata: PropTypes.shape({
        mapData: PropTypes.shape({
          systems: PropTypes.array,
          connections: PropTypes.array
        })
      })
    })
  }),
  onComplete: PropTypes.func,
  onProgress: PropTypes.func,
  className: PropTypes.string
};

export default MapSimulationContainer;