import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ConsequenceVisualization Component
 * 
 * This component visualizes the consequences of a decision,
 * showing them with appropriate styling and animations.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.consequences - Array of consequence objects
 * @param {Object} props.decision - The decision that led to these consequences
 * @param {boolean} props.animate - Whether to animate the consequences appearing
 */
const ConsequenceVisualization = ({ consequences, decision, animate = true }) => {
  const [visibleConsequences, setVisibleConsequences] = useState([]);

  // Show consequences with delays if animation is enabled
  useEffect(() => {
    if (!animate) {
      setVisibleConsequences(consequences);
      return;
    }

    const timers = [];
    consequences.forEach((consequence, index) => {
      const delay = consequence.delay || index * 1000; // Default 1s between consequences
      const timer = setTimeout(() => {
        setVisibleConsequences(prev => [...prev, consequence]);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [consequences, animate]);

  // Get consequence type styling
  const getConsequenceStyle = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'neutral':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Get consequence icon
  const getConsequenceIcon = (type) => {
    switch (type) {
      case 'positive':
        return (
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'negative':
        return (
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get impact badge style
  const getImpactBadgeStyle = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Decision Consequences</h3>
        
        {/* Decision summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Your Decision:</h4>
          <p className="text-gray-700">{decision?.text}</p>
          {decision?.description && (
            <p className="text-gray-600 text-sm mt-1">{decision.description}</p>
          )}
        </div>
        
        {/* Consequences */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Resulting Consequences:</h4>
          
          {visibleConsequences.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-pulse flex justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-gray-500">Analyzing consequences...</p>
            </div>
          )}
          
          {visibleConsequences.map((consequence, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getConsequenceStyle(consequence.type)} ${
                animate ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  {getConsequenceIcon(consequence.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{consequence.description}</p>
                  {consequence.impact && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactBadgeStyle(consequence.impact)}`}>
                        {consequence.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Guidance based on consequences */}
        {visibleConsequences.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Learning Point:</strong> In cybercrime cases, your decisions can have significant impacts on case outcomes. 
                  Consider the timeline, evidence available, and victim needs when deciding whether to escalate to FIR or wait for more information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ConsequenceVisualization.propTypes = {
  consequences: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['positive', 'negative', 'neutral']),
      description: PropTypes.string.isRequired,
      impact: PropTypes.oneOf(['low', 'medium', 'high']),
      delay: PropTypes.number
    })
  ).isRequired,
  decision: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  animate: PropTypes.bool
};

export default ConsequenceVisualization;