import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * CountdownTimer component
 * 
 * A flexible countdown timer with visual indicators and callbacks for different states.
 * Supports various display modes and time pressure indicators.
 * 
 * @param {Object} props - Component props
 * @param {number} props.duration - Timer duration in seconds
 * @param {Function} props.onComplete - Callback when timer reaches zero
 * @param {Function} props.onTick - Callback on each second tick (optional)
 * @param {Function} props.onWarning - Callback when entering warning zone (optional)
 * @param {Function} props.onCritical - Callback when entering critical zone (optional)
 * @param {boolean} props.autoStart - Whether to start timer automatically
 * @param {string} props.size - Timer size: 'small', 'medium', 'large'
 * @param {string} props.variant - Timer variant: 'default', 'urgent', 'critical'
 * @param {boolean} props.showProgress - Whether to show progress ring
 * @param {number} props.warningThreshold - Percentage at which to show warning (default: 30)
 * @param {number} props.criticalThreshold - Percentage at which to show critical (default: 10)
 */
const CountdownTimer = ({
  duration,
  onComplete,
  onTick,
  onWarning,
  onCritical,
  autoStart = true,
  size = 'medium',
  variant = 'default',
  showProgress = true,
  warningThreshold = 30,
  criticalThreshold = 10
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasWarned, setHasWarned] = useState(false);
  const [hasCritical, setHasCritical] = useState(false);

  // Calculate time state
  const progress = (timeLeft / duration) * 100;
  const isWarning = progress <= warningThreshold && progress > criticalThreshold;
  const isCritical = progress <= criticalThreshold;

  // Format time display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Call onTick callback
          if (onTick) {
            onTick(newTime, duration - newTime);
          }

          // Check for warning threshold
          const newProgress = (newTime / duration) * 100;
          if (newProgress <= warningThreshold && newProgress > criticalThreshold && !hasWarned) {
            setHasWarned(true);
            if (onWarning) {
              onWarning(newTime);
            }
          }

          // Check for critical threshold
          if (newProgress <= criticalThreshold && !hasCritical) {
            setHasCritical(true);
            if (onCritical) {
              onCritical(newTime);
            }
          }

          // Check if timer completed
          if (newTime <= 0) {
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, duration, onComplete, onTick, onWarning, onCritical, warningThreshold, criticalThreshold, hasWarned, hasCritical]);

  // Control functions
  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
    setHasWarned(false);
    setHasCritical(false);
  }, [duration, autoStart]);

  const addTime = useCallback((seconds) => {
    setTimeLeft(prevTime => Math.min(prevTime + seconds, duration));
  }, [duration]);

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-16 h-16',
      text: 'text-xs',
      ring: 'w-16 h-16',
      strokeWidth: 2
    },
    medium: {
      container: 'w-24 h-24',
      text: 'text-sm',
      ring: 'w-24 h-24',
      strokeWidth: 3
    },
    large: {
      container: 'w-32 h-32',
      text: 'text-lg',
      ring: 'w-32 h-32',
      strokeWidth: 4
    }
  };

  // Color configurations
  const getColorConfig = () => {
    if (isCritical || variant === 'critical') {
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-800',
        ring: 'stroke-red-500',
        pulse: 'animate-pulse'
      };
    } else if (isWarning || variant === 'urgent') {
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        ring: 'stroke-yellow-500',
        pulse: ''
      };
    } else {
      return {
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        text: 'text-blue-800',
        ring: 'stroke-blue-500',
        pulse: ''
      };
    }
  };

  const config = sizeConfig[size];
  const colors = getColorConfig();

  // Calculate SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="countdown-timer flex flex-col items-center space-y-2">
      {/* Timer Display */}
      <div className={`relative ${config.container} ${colors.pulse}`}>
        {/* Progress Ring */}
        {showProgress && (
          <svg
            className={`absolute inset-0 ${config.ring} transform -rotate-90`}
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.strokeWidth}
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`${colors.ring} transition-all duration-1000 ease-linear`}
            />
          </svg>
        )}
        
        {/* Timer Text */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          ${config.text} ${colors.text} font-mono font-bold
          ${colors.bg} ${colors.border} border rounded-full
        `}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-2">
        {/* Time Status */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isCritical ? 'bg-red-100 text-red-800' :
          isWarning ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NORMAL'}
        </div>

        {/* Running Status */}
        <div className={`w-2 h-2 rounded-full ${
          isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`} />
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2">
        {!isRunning && timeLeft > 0 && (
          <button
            onClick={start}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
          >
            Start
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={pause}
            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar Alternative */}
      {!showProgress && (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-linear ${
                isCritical ? 'bg-red-500' :
                isWarning ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

CountdownTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onTick: PropTypes.func,
  onWarning: PropTypes.func,
  onCritical: PropTypes.func,
  autoStart: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'urgent', 'critical']),
  showProgress: PropTypes.bool,
  warningThreshold: PropTypes.number,
  criticalThreshold: PropTypes.number
};

export default CountdownTimer;