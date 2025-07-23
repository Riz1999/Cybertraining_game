import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimelineVisualization from '../timeline/TimelineVisualization';
import DecisionPointComponent from '../decision/DecisionPointComponent';
import EnhancedDecisionInterface from '../decision/EnhancedDecisionInterface';
import ConsequenceVisualization from '../decision/ConsequenceVisualization';
import ContextInfoDisplay from '../context/ContextInfoDisplay';
import ComplaintDelayScenarioService from '../../../simulation/services/ComplaintDelayScenarioService';
import { sortTimelineEvents } from '../../../simulation/utils/helpers';

/**
 * ComplaintDelayScenarioSimulation Component
 * 
 * Main component for the complaint delay scenario simulation.
 * Integrates timeline visualization, decision points, and context information.
 */
const ComplaintDelayScenarioSimulation = ({ onComplete, options = {} }) => {
  const [scenarioService] = useState(new ComplaintDelayScenarioService());
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeDecisionPoint, setActiveDecisionPoint] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showConsequences, setShowConsequences] = useState(false);
  const [consequences, setConsequences] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Initialize scenario
  useEffect(() => {
    const initScenario = async () => {
      try {
        // Generate a new scenario
        const newScenario = scenarioService.generateScenario(options);
        setScenario(newScenario);
        
        // Set initial active event
        const startEvent = newScenario.getStartTimelineEvent();
        if (startEvent) {
          setActiveEventId(startEvent.id);
          setActiveEvent(startEvent);
          
          // Check if this event has a decision point
          const decisionPoint = newScenario.getDecisionPointByTimelineEvent(startEvent.id);
          if (decisionPoint) {
            setActiveDecisionPoint(decisionPoint);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing scenario:', error);
        setLoading(false);
      }
    };
    
    initScenario();
  }, [scenarioService, options]);

  // Handle timeline event click
  const handleEventClick = (event) => {
    setActiveEventId(event.id);
    setActiveEvent(event);
    
    // Check if this event has a decision point
    if (scenario) {
      const decisionPoint = scenario.getDecisionPointByTimelineEvent(event.id);
      setActiveDecisionPoint(decisionPoint);
    }
  };

  // Handle decision made
  const handleDecisionMade = (option, continueAfterFeedback = false) => {
    // Record the decision
    const newDecision = {
      decisionPointId: activeDecisionPoint.id,
      optionId: option.id,
      optionValue: option.value,
      points: option.points,
      isCorrect: option.isCorrect,
      timestamp: new Date()
    };
    
    // Store the selected option for consequence visualization
    setSelectedOption(option);
    
    // Generate consequences based on the option category
    const generatedConsequences = generateConsequences(option);
    setConsequences(generatedConsequences);
    
    setDecisions([...decisions, newDecision]);
    
    // Update score
    setScore(prevScore => prevScore + option.points);
    
    // Show consequences after feedback is shown
    if (!continueAfterFeedback) {
      setShowConsequences(true);
    } else {
      // If continuing after feedback, check if simulation is complete
      // For this implementation, we'll consider the simulation complete after the first decision
      // In a more complex scenario, you might check for additional decision points or events
      setSimulationComplete(true);
      
      // Notify parent component of completion
      if (onComplete) {
        onComplete({
          success: option.isCorrect,
          totalScore: score + option.points,
          decisions: [...decisions, newDecision],
          timeUsed: (new Date() - new Date(scenario.createdAt)) / 1000, // in seconds
          accuracy: option.isCorrect ? 1 : 0
        });
      }
    }
  };
  
  // Generate consequences based on the selected option
  const generateConsequences = (option) => {
    const consequences = [];
    
    // Base consequences on the option category
    switch (option.category) {
      case 'escalate':
        if (option.isCorrect) {
          consequences.push({
            type: 'positive',
            description: 'Case escalated to senior officer for FIR filing',
            impact: 'high',
            delay: 0
          });
          consequences.push({
            type: 'positive',
            description: 'Investigation process formally initiated',
            impact: 'medium',
            delay: 1000
          });
          consequences.push({
            type: 'positive',
            description: 'Victim notified of case escalation',
            impact: 'medium',
            delay: 2000
          });
        } else {
          consequences.push({
            type: 'negative',
            description: 'Premature escalation created unnecessary workload',
            impact: 'medium',
            delay: 0
          });
          consequences.push({
            type: 'negative',
            description: 'Resources diverted from more critical cases',
            impact: 'medium',
            delay: 1000
          });
        }
        break;
        
      case 'wait':
        if (option.isCorrect) {
          consequences.push({
            type: 'positive',
            description: 'Additional evidence gathered during waiting period',
            impact: 'medium',
            delay: 0
          });
          consequences.push({
            type: 'positive',
            description: 'Case details verified for accuracy',
            impact: 'medium',
            delay: 1000
          });
        } else {
          consequences.push({
            type: 'negative',
            description: 'Case delayed beyond acceptable timeframe',
            impact: 'high',
            delay: 0
          });
          consequences.push({
            type: 'negative',
            description: 'Victim lost trust in police response',
            impact: 'high',
            delay: 1000
          });
          consequences.push({
            type: 'negative',
            description: 'Evidence trail became cold',
            impact: 'medium',
            delay: 2000
          });
        }
        break;
        
      case 'file_fir':
        if (option.isCorrect) {
          consequences.push({
            type: 'positive',
            description: 'Case formally entered into CCTNS system',
            impact: 'high',
            delay: 0
          });
          consequences.push({
            type: 'positive',
            description: 'Investigation team assigned',
            impact: 'high',
            delay: 1000
          });
          consequences.push({
            type: 'positive',
            description: 'Legal proceedings initiated',
            impact: 'medium',
            delay: 2000
          });
        } else {
          consequences.push({
            type: 'negative',
            description: 'Incomplete case filed in CCTNS',
            impact: 'medium',
            delay: 0
          });
          consequences.push({
            type: 'negative',
            description: 'Additional paperwork required to correct filing',
            impact: 'low',
            delay: 1000
          });
        }
        break;
        
      default:
        consequences.push({
          type: option.isCorrect ? 'positive' : 'negative',
          description: option.isCorrect ? 'Decision recorded as appropriate action' : 'Decision recorded as inappropriate action',
          impact: 'medium',
          delay: 0
        });
    }
    
    return consequences;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state if scenario failed to load
  if (!scenario) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load scenario. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
        <p className="text-gray-600 mt-1">{scenario.description}</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Timeline visualization */}
          <div className="lg:col-span-1 border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Timeline</h3>
            <TimelineVisualization
              events={sortTimelineEvents(scenario.timelineEvents)}
              activeEventId={activeEventId}
              onEventClick={handleEventClick}
            />
          </div>
          
          {/* Right column: Context info and decision point */}
          <div className="lg:col-span-2 space-y-6">
            {/* Context information */}
            <ContextInfoDisplay
              scenario={scenario.scenario}
              activeEvent={activeEvent}
            />
            
            {/* Decision point (if available for the active event) */}
            {activeDecisionPoint && !showConsequences && (
              <EnhancedDecisionInterface
                decisionPoint={activeDecisionPoint}
                onDecisionMade={handleDecisionMade}
                showTimer={activeDecisionPoint.timeLimit ? true : false}
                timeLimit={activeDecisionPoint.timeLimit}
              />
            )}
            
            {/* Show consequences after decision is made */}
            {showConsequences && selectedOption && (
              <ConsequenceVisualization
                consequences={consequences}
                decision={selectedOption}
                animate={true}
              />
            )}
            
            {/* If no decision point is available, show guidance */}
            {activeEvent && !activeDecisionPoint && !showConsequences && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Information</h3>
                <p className="text-gray-700 mb-4">
                  This is an informational event in the case timeline. Review the details and continue exploring the timeline to find decision points.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Look for events marked with a yellow or red icon, as these may require decisions or actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ComplaintDelayScenarioSimulation.propTypes = {
  onComplete: PropTypes.func,
  options: PropTypes.shape({
    complexity: PropTypes.oneOf(['simple', 'medium', 'complex']),
    caseType: PropTypes.oneOf(['financial', 'identity', 'harassment']),
    timeSpan: PropTypes.number,
    decisionPoints: PropTypes.number
  })
};

export default ComplaintDelayScenarioSimulation;