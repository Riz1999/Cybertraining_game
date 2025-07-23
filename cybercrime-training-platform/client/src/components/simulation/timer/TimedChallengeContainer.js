import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CountdownTimer from './CountdownTimer';
import TimePressureIndicator from './TimePressureIndicator';
import TimerResultAnimation from './TimerResultAnimation';
import { calculateTimerScore, calculateTimeBonus } from './TimerScoring';

/**
 * TimedChallengeContainer component
 * 
 * A comprehensive container for timed challenges that integrates timer,
 * pressure indicators, scoring, and result animations.
 * 
 * @param {Object} props - Component props
 * @param {number} props.timeLimit - Time limit in seconds
 * @param {React.Component} props.children - Challenge content
 * @param {Function} props.onComplete - Callback when challenge completes
 * @param {Function} props.onTimeUp - Callback when time runs out
 * @param {Object} props.challengeData - Challenge configuration data
 * @param {boolean} props.autoStart - Whether to start timer automatically
 * @param {string} props.title - Challenge title
 * @param {string} props.description - Challenge description
 * @param {Object} props.scoringWeights - Custom scoring weights
 */
const TimedChallengeContainer = ({
  timeLimit,
  children,
  onComplete,
  onTimeUp,
  challengeData = {},
  autoStart = true,
  title = 'Timed Challenge',
  description = 'Complete the challenge within the time limit',
  scoringWeights
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isActive, setIsActive] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [userActions, setUserActions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [challengeState, setChallengeState] = useState('ready'); // ready, active, completed, timeout

  // Initialize start time when timer becomes active
  useEffect(() => {
    if (isActive && !startTime) {
      setStartTime(Date.now());
      setChallengeState('active');
    }
  }, [isActive, startTime]);

  // Handle timer tick
  const handleTimerTick = useCallback((newTimeLeft, elapsedTime) => {
    setTimeLeft(newTimeLeft);
  }, []);

  // Handle timer completion (time up)
  const handleTimeUp = useCallback(() => {
    if (!isCompleted && isActive) {
      setIsCompleted(true);
      setIsActive(false);
      setEndTime(Date.now());
      setChallengeState('timeout');
      
      // Calculate score for timeout scenario
      const timeUsed = startTime ? (Date.now() - startTime) / 1000 : timeLimit;
      const scoring = calculateTimerScore({
        timeLimit,
        timeUsed,
        accuracy: 0, // No accuracy for timeout
        completed: false,
        weights: scoringWeights
      });

      setScoreData(scoring);
      setShowResults(true);

      if (onTimeUp) {
        onTimeUp(scoring);
      }
    }
  }, [isCompleted, isActive, startTime, timeLimit, scoringWeights, onTimeUp]);

  // Handle challenge completion by user
  const handleChallengeComplete = useCallback((accuracy = 1, additionalData = {}) => {
    if (!isCompleted && isActive) {
      setIsCompleted(true);
      setIsActive(false);
      setEndTime(Date.now());
      setChallengeState('completed');

      const timeUsed = startTime ? (Date.now() - startTime) / 1000 : 0;
      
      // Calculate base score
      const scoring = calculateTimerScore({
        timeLimit,
        timeUsed,
        accuracy,
        completed: true,
        weights: scoringWeights
      });

      // Calculate time bonus
      const bonus = calculateTimeBonus(timeLimit, timeUsed, scoring.totalScore);
      
      const finalScoreData = {
        ...scoring,
        bonus,
        additionalData,
        userActions: userActions.length
      };

      setScoreData(finalScoreData);
      setShowResults(true);

      if (onComplete) {
        onComplete(finalScoreData);
      }
    }
  }, [isCompleted, isActive, startTime, timeLimit, scoringWeights, userActions, onComplete]);

  // Track user actions
  const trackAction = useCallback((actionType, actionData = {}) => {
    if (isActive && startTime) {
      const action = {
        type: actionType,
        timestamp: (Date.now() - startTime) / 1000,
        data: actionData
      };
      setUserActions(prev => [...prev, action]);
    }
  }, [isActive, startTime]);

  // Control functions
  const startChallenge = useCallback(() => {
    if (!isActive && !isCompleted) {
      setIsActive(true);
      setStartTime(Date.now());
      setChallengeState('active');
    }
  }, [isActive, isCompleted]);

  const pauseChallenge = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetChallenge = useCallback(() => {
    setTimeLeft(timeLimit);
    setIsActive(autoStart);
    setIsCompleted(false);
    setStartTime(null);
    setEndTime(null);
    setUserActions([]);
    setShowResults(false);
    setScoreData(null);
    setChallengeState('ready');
  }, [timeLimit, autoStart]);

  // Handle urgency changes
  const handleUrgencyChange = useCallback((urgencyLevel, indicators) => {
    trackAction('urgency_change', { urgencyLevel, timeLeft: indicators.percentage });
  }, [trackAction]);

  // Handle result animation completion
  const handleAnimationComplete = useCallback(() => {
    setShowResults(false);
  }, []);

  // Determine result type for animation
  const getResultType = () => {
    if (!scoreData) return 'success';
    
    if (scoreData.bonus && scoreData.bonus.hadBonus) {
      return 'excellent';
    } else if (challengeState === 'timeout') {
      return 'timeout';
    } else if (scoreData.totalScore >= 80) {
      return 'success';
    } else {
      return 'failure';
    }
  };

  return (
    <div className="timed-challenge-container relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          
          {/* Timer display */}
          <div className="flex items-center space-x-4">
            <CountdownTimer
              duration={timeLimit}
              onComplete={handleTimeUp}
              onTick={handleTimerTick}
              autoStart={autoStart}
              size="medium"
              variant={challengeState === 'timeout' ? 'critical' : 'default'}
            />
          </div>
        </div>
      </div>

      {/* Time pressure indicator */}
      <TimePressureIndicator
        timeLeft={timeLeft}
        totalTime={timeLimit}
        position="top"
        showAlerts={true}
        enableSound={false}
        onUrgencyChange={handleUrgencyChange}
      />

      {/* Challenge content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Challenge status */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                challengeState === 'active' ? 'bg-green-100 text-green-800' :
                challengeState === 'completed' ? 'bg-blue-100 text-blue-800' :
                challengeState === 'timeout' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {challengeState === 'active' ? 'IN PROGRESS' :
                 challengeState === 'completed' ? 'COMPLETED' :
                 challengeState === 'timeout' ? 'TIME UP' :
                 'READY'}
              </div>
              
              <div className="text-sm text-gray-600">
                Actions: {userActions.length}
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex space-x-2">
              {challengeState === 'ready' && (
                <button
                  onClick={startChallenge}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Challenge
                </button>
              )}
              
              {challengeState === 'active' && (
                <button
                  onClick={pauseChallenge}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Pause
                </button>
              )}
              
              {(challengeState === 'completed' || challengeState === 'timeout') && (
                <button
                  onClick={resetChallenge}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Challenge content with context */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {React.cloneElement(children, {
            isActive,
            timeLeft,
            onComplete: handleChallengeComplete,
            trackAction,
            challengeState
          })}
        </div>
      </div>

      {/* Result animation */}
      {showResults && scoreData && (
        <TimerResultAnimation
          result={getResultType()}
          scoreData={scoreData}
          onAnimationComplete={handleAnimationComplete}
          showConfetti={scoreData.totalScore >= 80}
        />
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono">
          <div>State: {challengeState}</div>
          <div>Time Left: {timeLeft}s</div>
          <div>Actions: {userActions.length}</div>
          {scoreData && <div>Score: {scoreData.totalScore}%</div>}
        </div>
      )}
    </div>
  );
};

TimedChallengeContainer.propTypes = {
  timeLimit: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
  onComplete: PropTypes.func,
  onTimeUp: PropTypes.func,
  challengeData: PropTypes.object,
  autoStart: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  scoringWeights: PropTypes.shape({
    completion: PropTypes.number,
    speed: PropTypes.number,
    accuracy: PropTypes.number
  })
};

export default TimedChallengeContainer;