import React from 'react';
import PropTypes from 'prop-types';
import { COMMUNICATION_METRICS } from '../../../simulation/specialized/dialog/DialogTypes';

/**
 * CommunicationMetrics component
 * 
 * This component displays communication metrics in a visual format.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.metrics - The communication metrics
 * @param {number} props.score - The overall score
 * @param {boolean} props.showDetails - Whether to show detailed metrics
 */
const CommunicationMetrics = ({ 
  metrics = {}, 
  score = 0,
  showDetails = false
}) => {
  // Get the metrics or use defaults
  const empathy = metrics[COMMUNICATION_METRICS.EMPATHY] || 0;
  const clarity = metrics[COMMUNICATION_METRICS.CLARITY] || 0;
  const professionalism = metrics[COMMUNICATION_METRICS.PROFESSIONALISM] || 0;
  const patience = metrics[COMMUNICATION_METRICS.PATIENCE] || 0;
  const accuracy = metrics[COMMUNICATION_METRICS.ACCURACY] || 0;
  
  // Helper function to get color class based on score
  const getScoreColorClass = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    if (score >= 3) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Helper function to get text color class based on score
  const getTextColorClass = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    if (score >= 3) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Helper function to get percentage width for progress bar
  const getPercentage = (value) => {
    return Math.min(Math.max(value * 10, 0), 100);
  };
  
  // Helper function to get label for metric
  const getMetricLabel = (metric) => {
    return metric.charAt(0).toUpperCase() + metric.slice(1);
  };
  
  return (
    <div className="communication-metrics">
      {/* Overall score */}
      <div className="overall-score flex items-center justify-between mb-4">
        <div className="score-label text-gray-700">Overall Score:</div>
        <div className={`score-value font-bold text-xl ${getTextColorClass(score)}`}>
          {Math.round(score * 10)}/100
        </div>
      </div>
      
      {/* Metrics visualization */}
      <div className="metrics-visualization space-y-3">
        {/* Empathy */}
        <div className="metric-item">
          <div className="flex justify-between text-sm mb-1">
            <span className="metric-label text-gray-600">Empathy</span>
            <span className={`metric-value font-medium ${getTextColorClass(empathy)}`}>
              {Math.round(empathy * 10)}/10
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreColorClass(empathy)}`}
              style={{ width: `${getPercentage(empathy)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Clarity */}
        <div className="metric-item">
          <div className="flex justify-between text-sm mb-1">
            <span className="metric-label text-gray-600">Clarity</span>
            <span className={`metric-value font-medium ${getTextColorClass(clarity)}`}>
              {Math.round(clarity * 10)}/10
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreColorClass(clarity)}`}
              style={{ width: `${getPercentage(clarity)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Professionalism */}
        <div className="metric-item">
          <div className="flex justify-between text-sm mb-1">
            <span className="metric-label text-gray-600">Professionalism</span>
            <span className={`metric-value font-medium ${getTextColorClass(professionalism)}`}>
              {Math.round(professionalism * 10)}/10
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreColorClass(professionalism)}`}
              style={{ width: `${getPercentage(professionalism)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Patience */}
        <div className="metric-item">
          <div className="flex justify-between text-sm mb-1">
            <span className="metric-label text-gray-600">Patience</span>
            <span className={`metric-value font-medium ${getTextColorClass(patience)}`}>
              {Math.round(patience * 10)}/10
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreColorClass(patience)}`}
              style={{ width: `${getPercentage(patience)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Accuracy (if available) */}
        {accuracy > 0 && (
          <div className="metric-item">
            <div className="flex justify-between text-sm mb-1">
              <span className="metric-label text-gray-600">Accuracy</span>
              <span className={`metric-value font-medium ${getTextColorClass(accuracy)}`}>
                {Math.round(accuracy * 10)}/10
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColorClass(accuracy)}`}
                style={{ width: `${getPercentage(accuracy)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Detailed metrics */}
      {showDetails && (
        <div className="detailed-metrics mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold mb-3">Communication Tips</h4>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Show <strong>empathy</strong> by acknowledging the victim&apos;s feelings and concerns.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Maintain <strong>clarity</strong> by using simple language and explaining procedures.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Demonstrate <strong>professionalism</strong> through respectful and knowledgeable responses.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Practice <strong>patience</strong> by allowing victims time to express themselves fully.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

CommunicationMetrics.propTypes = {
  metrics: PropTypes.object,
  score: PropTypes.number,
  showDetails: PropTypes.bool
};

export default CommunicationMetrics;