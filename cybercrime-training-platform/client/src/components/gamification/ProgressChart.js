import React from 'react';
import { Card } from '../ui';

/**
 * Progress Chart component for visualizing user's progress over time
 * @param {Object} props - Component props
 * @param {Array} props.data - Progress data points
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Progress Chart component
 */
const ProgressChart = ({ data = [], loading = false, className = '' }) => {
  // If no data and not loading, don't render
  if (data.length === 0 && !loading) {
    return null;
  }

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = '100%';
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const innerWidth = '100%';

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value), 0);

  // Generate points for the line
  const points = data.map((d, i) => {
    const x = `${(i / (data.length - 1)) * 100}%`;
    const y = maxValue > 0 ? innerHeight - (d.value / maxValue) * innerHeight : innerHeight;
    return `${x},${y}`;
  }).join(' ');

  // Generate area under the line
  const area = [
    ...points.split(' '),
    `100%,${innerHeight}`,
    `0,${innerHeight}`
  ].join(' ');

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Progress Over Time</h3>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-blue"></div>
          </div>
        ) : (
          <div className="relative h-[200px]">
            <svg width={chartWidth} height={chartHeight} className="overflow-visible">
              {/* Y-axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={chartHeight - padding.bottom}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              
              {/* X-axis */}
              <line
                x1={padding.left}
                y1={chartHeight - padding.bottom}
                x2="100%"
                y2={chartHeight - padding.bottom}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              
              {/* Y-axis labels */}
              <text
                x={padding.left - 5}
                y={padding.top}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {maxValue}
              </text>
              <text
                x={padding.left - 5}
                y={chartHeight - padding.bottom}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                0
              </text>
              
              {/* X-axis labels */}
              {data.map((d, i) => (
                i % Math.ceil(data.length / 5) === 0 && (
                  <text
                    key={i}
                    x={`${(i / (data.length - 1)) * 100}%`}
                    y={chartHeight - padding.bottom + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {d.label}
                  </text>
                )
              ))}
              
              {/* Chart content */}
              <g transform={`translate(${padding.left}, ${padding.top})`}>
                {/* Area under the line */}
                <polygon
                  points={area}
                  fill="rgba(59, 130, 246, 0.1)"
                />
                
                {/* Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                
                {/* Data points */}
                {data.map((d, i) => {
                  const x = `${(i / (data.length - 1)) * 100}%`;
                  const y = maxValue > 0 ? innerHeight - (d.value / maxValue) * innerHeight : innerHeight;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                    />
                  );
                })}
              </g>
            </svg>
            
            {data.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">No progress data available</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Track your progress over time to see your improvement
        </div>
      </div>
    </Card>
  );
};

export default ProgressChart;