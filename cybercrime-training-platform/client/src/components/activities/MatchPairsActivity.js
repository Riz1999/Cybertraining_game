import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MatchPairsActivity = ({ instructions, pairs, onComplete, disabled = false }) => {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Debug: Log props received (remove this in production)
  console.log("MatchPairsActivity props:", { instructions, pairs, disabled });

  // Initialize items
  useEffect(() => {
    if (pairs && pairs.length > 0) {
      // Create arrays from pairs
      const left = pairs.map(pair => ({
        id: pair.id,
        content: pair.left
      }));

      const right = pairs.map(pair => ({
        id: pair.id,
        content: pair.right
      }));

      // Shuffle right items
      const shuffledRight = [...right].sort(() => Math.random() - 0.5);

      setLeftItems(left);
      setRightItems(shuffledRight);

      // Reset state when new pairs are loaded
      setMatches([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setCompleted(false);
    }
  }, [pairs]);

  const handleLeftSelect = (item) => {
    if (disabled || completed) return;

    // If already matched, do nothing
    if (isLeftMatched(item)) return;

    // If same item already selected, deselect it
    if (selectedLeft && selectedLeft.id === item.id) {
      setSelectedLeft(null);
      return;
    }

    setSelectedLeft(item);

    // If right is already selected, check for match
    if (selectedRight) {
      checkForMatch(item, selectedRight);
    }
  };

  const handleRightSelect = (item) => {
    if (disabled || completed) return;

    // If already matched, do nothing
    if (isRightMatched(item)) return;

    // If same item already selected, deselect it
    if (selectedRight && selectedRight.id === item.id) {
      setSelectedRight(null);
      return;
    }

    setSelectedRight(item);

    // If left is already selected, check for match
    if (selectedLeft) {
      checkForMatch(selectedLeft, item);
    }
  };

  const checkForMatch = (left, right) => {
    if (left.id === right.id) {
      // It's a match!
      const updatedMatches = [...matches, { leftId: left.id, rightId: right.id }];
      setMatches(updatedMatches);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs are matched
      if (updatedMatches.length === pairs.length) {
        handleComplete();
      }
    } else {
      // Not a match, clear selections after a short delay
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  };

  const handleComplete = () => {
    const calculatedScore = 10; // Full score for completing all matches
    setScore(calculatedScore);
    setCompleted(true);

    // Notify parent component
    if (onComplete) {
      onComplete(calculatedScore);
    }
  };

  const isLeftSelected = (item) => {
    return selectedLeft && selectedLeft.id === item.id;
  };

  const isRightSelected = (item) => {
    return selectedRight && selectedRight.id === item.id;
  };

  const isLeftMatched = (item) => {
    return matches.some(match => match.leftId === item.id);
  };

  const isRightMatched = (item) => {
    return matches.some(match => match.rightId === item.id);
  };

  const getMatchedRightId = (leftId) => {
    const match = matches.find(m => m.leftId === leftId);
    return match ? match.rightId : null;
  };

  const getMatchedLeftId = (rightId) => {
    const match = matches.find(m => m.rightId === rightId);
    return match ? match.leftId : null;
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium mb-2">Match Pairs Activity</h3>
      <p className="text-gray-600 mb-6">{instructions}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left column */}
        <div>
          <h4 className="font-medium mb-3">Fields</h4>
          <div className="space-y-3">
            {leftItems.map(item => {
              const isMatched = isLeftMatched(item);
              const isSelected = isLeftSelected(item);
              const matchedRightId = getMatchedRightId(item.id);
              const matchedRight = matchedRightId ? rightItems.find(r => r.id === matchedRightId) : null;

              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : isMatched
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                    } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={() => handleLeftSelect(item)}
                >
                  <p className="text-gray-800">{item.content}</p>

                  {isMatched && matchedRight && (
                    <div className="mt-2 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-sm text-green-600">Matched with: {matchedRight.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div>
          <h4 className="font-medium mb-3">Values</h4>
          <div className="space-y-3">
            {rightItems.map(item => {
              const isMatched = isRightMatched(item);
              const isSelected = isRightSelected(item);
              const matchedLeftId = getMatchedLeftId(item.id);
              const matchedLeft = matchedLeftId ? leftItems.find(l => l.id === matchedLeftId) : null;

              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : isMatched
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                    } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={() => handleRightSelect(item)}
                >
                  <p className="text-gray-800">{item.content}</p>

                  {isMatched && matchedLeft && (
                    <div className="mt-2 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-sm text-green-600">Matched with: {matchedLeft.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Progress</p>
          <p className="text-sm">{matches.length} of {pairs.length} matched</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(matches.length / pairs.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Instructions */}
      {!completed && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <h4 className="font-medium text-blue-800 mb-2">How to Match</h4>
          <p className="text-blue-700">
            Click on an item from the &quot;Fields&quot; column, then click on the matching item from the &quot;Values&quot; column.
            If they match, they will be highlighted in green. Match all pairs to complete the activity.
          </p>
        </div>
      )}

      {/* Completion message */}
      {completed && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <h4 className="font-medium text-green-800 mb-2">All pairs matched!</h4>
          <p className="text-green-700">
            Great job! You&apos;ve successfully matched all the pairs.
          </p>
        </div>
      )}
    </div>
  );
};

MatchPairsActivity.propTypes = {
  instructions: PropTypes.string.isRequired,
  pairs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      left: PropTypes.string.isRequired,
      right: PropTypes.string.isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default MatchPairsActivity;