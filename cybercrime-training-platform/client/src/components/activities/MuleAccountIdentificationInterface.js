import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import MatchPairsActivity from './MatchPairsActivity';

const MuleAccountIdentificationInterface = ({ accountData, instructions, onComplete, disabled = false }) => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCharacteristics, setShowCharacteristics] = useState(false);
  const [matchPairsCompleted, setMatchPairsCompleted] = useState(false);
  
  // Reset state when new data is loaded
  useEffect(() => {
    if (disabled) return;
    
    setSelectedAccounts([]);
    setFeedback('');
    setCompleted(false);
    setScore(0);
    setShowHint(false);
    setShowCharacteristics(false);
    setMatchPairsCompleted(false);
  }, [accountData, disabled]);

  // Handle account selection
  const handleAccountSelect = (accountId) => {
    if (disabled || completed) return;
    
    // Toggle selection
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };

  // Handle submission of selected mule accounts
  const handleSubmit = () => {
    if (disabled || completed || selectedAccounts.length === 0) return;
    
    // Get actual mule accounts from data
    const actualMuleAccounts = accountData.filter(account => account.isMule).map(account => account.id);
    
    // Calculate correct selections
    const correctSelections = selectedAccounts.filter(id => actualMuleAccounts.includes(id));
    const incorrectSelections = selectedAccounts.filter(id => !actualMuleAccounts.includes(id));
    const missedSelections = actualMuleAccounts.filter(id => !selectedAccounts.includes(id));
    
    // Calculate score (out of 15 points for this part)
    const maxPartScore = 15;
    const partScore = Math.max(0, Math.round(
      maxPartScore * (correctSelections.length / actualMuleAccounts.length) -
      (incorrectSelections.length * (maxPartScore / actualMuleAccounts.length / 2))
    ));
    
    // Update score
    const totalScore = matchPairsCompleted ? partScore + 10 : partScore;
    setScore(totalScore);
    
    // Generate feedback
    if (correctSelections.length === actualMuleAccounts.length && incorrectSelections.length === 0) {
      setFeedback('Perfect! You correctly identified all mule accounts.');
      setCompleted(true);
      
      // Notify parent component
      if (onComplete) {
        onComplete(totalScore);
      }
    } else if (correctSelections.length > 0 && incorrectSelections.length === 0) {
      setFeedback(`Good work! You found ${correctSelections.length} of ${actualMuleAccounts.length} mule accounts. Keep looking for more.`);
    } else if (incorrectSelections.length > 0) {
      setFeedback(`You incorrectly identified ${incorrectSelections.length} account(s) as mule accounts. Review the characteristics and try again.`);
    } else {
      setFeedback('You haven\'t selected any accounts. Try to identify the mule accounts based on their characteristics.');
    }
  };

  // Handle match pairs completion
  const handleMatchPairsComplete = (pairsScore) => {
    setMatchPairsCompleted(true);
    
    // If main activity is already completed, update the total score
    if (completed) {
      const newTotalScore = score + 10;
      setScore(newTotalScore);
      
      // Notify parent component of updated score
      if (onComplete) {
        onComplete(newTotalScore);
      }
    }
    
    setFeedback('Great job! You\'ve matched all the mule account characteristics. Now identify the mule accounts in the list.');
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // Toggle characteristics visibility
  const toggleCharacteristics = () => {
    setShowCharacteristics(!showCharacteristics);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-2">Mule Account Identification</h3>
        <p className="text-gray-600 mb-6">{instructions}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleHint}
                disabled={disabled || completed}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleCharacteristics}
              >
                {showCharacteristics ? 'Hide Characteristics' : 'Show Characteristics'}
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              {selectedAccounts.length} account(s) selected
            </div>
          </div>
          
          {feedback && (
            <div className={`p-3 mb-4 text-sm rounded ${
              feedback.includes('Perfect') || feedback.includes('Great job')
                ? 'bg-green-50 text-green-700'
                : feedback.includes('Good work')
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-yellow-50 text-yellow-700'
            }`}>
              {feedback}
            </div>
          )}
          
          {showHint && (
            <div className="p-3 mb-4 bg-blue-50 border border-blue-100 rounded-md">
              <h4 className="font-medium text-blue-800 mb-1">Hint</h4>
              <p className="text-blue-700 text-sm">Look for accounts with unusual transaction patterns, recently opened accounts with high transaction volumes, or accounts with mismatched KYC information. Mule accounts often receive funds and quickly transfer them out to multiple destinations.</p>
            </div>
          )}
        </div>
        
        {showCharacteristics && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Mule Account Characteristics</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Recently opened accounts with unusually high transaction volumes</li>
              <li>Accounts that receive large deposits followed by immediate withdrawals</li>
              <li>Multiple small deposits from various sources followed by large withdrawals</li>
              <li>Account holder details that don&apos;t match transaction patterns</li>
              <li>Accounts opened with minimal KYC documentation</li>
              <li>Accounts registered to addresses that don&apos;t match the transaction locations</li>
              <li>Multiple accounts linked to the same mobile number or email</li>
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {accountData.map(account => (
            <div 
              key={account.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAccounts.includes(account.id)
                  ? 'border-blue-500 bg-blue-50'
                  : completed && account.isMule
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={() => handleAccountSelect(account.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{account.accountNumber}</h4>
                  <p className="text-sm text-gray-600">{account.bank}, {account.branch}</p>
                </div>
                <div className="flex items-center">
                  {selectedAccounts.includes(account.id) && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {completed && account.isMule && !selectedAccounts.includes(account.id) && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Account Holder:</span> {account.accountHolder}
                </div>
                <div>
                  <span className="text-gray-500">Account Type:</span> {account.accountType}
                </div>
                <div>
                  <span className="text-gray-500">Opening Date:</span> {account.openingDate}
                </div>
                <div>
                  <span className="text-gray-500">KYC Status:</span> {account.kycStatus}
                </div>
              </div>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium mb-1">Transaction Pattern</h5>
                <p className="text-sm text-gray-600">{account.transactionPattern}</p>
              </div>
              
              {account.flags && account.flags.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium mb-1">Flags</h5>
                  <div className="flex flex-wrap gap-2">
                    {account.flags.map((flag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={disabled || completed || selectedAccounts.length === 0}
          >
            Submit Selected Accounts
          </Button>
        </div>
        
        {completed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Mule Account Identification Completed!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>You&apos;ve successfully identified all mule accounts in the transaction chain.</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-800">Score:</span>
                    <span className="ml-2 text-sm text-green-800">{score}/25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Match Mule Account Characteristics</h3>
          <p className="text-gray-600 mb-6">Match each mule account characteristic with its corresponding red flag indicator.</p>
          
          <MatchPairsActivity
            instructions="Match each characteristic on the left with the corresponding indicator on the right."
            pairs={[
              {
                id: "pair1",
                left: "Recently opened account",
                right: "Account less than 3 months old with high transaction volume"
              },
              {
                id: "pair2",
                left: "Rapid fund movement",
                right: "Deposits followed by immediate withdrawals"
              },
              {
                id: "pair3",
                left: "Multiple small deposits",
                right: "Numerous transactions just below reporting thresholds"
              },
              {
                id: "pair4",
                left: "Mismatched KYC",
                right: "Account holder details don't match transaction patterns"
              },
              {
                id: "pair5",
                left: "Geographic inconsistency",
                right: "Transactions from locations far from registered address"
              }
            ]}
            onComplete={handleMatchPairsComplete}
            disabled={disabled || matchPairsCompleted}
          />
        </div>
      </Card>
    </div>
  );
};

MuleAccountIdentificationInterface.propTypes = {
  accountData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      accountNumber: PropTypes.string.isRequired,
      accountHolder: PropTypes.string.isRequired,
      bank: PropTypes.string.isRequired,
      branch: PropTypes.string.isRequired,
      accountType: PropTypes.string.isRequired,
      openingDate: PropTypes.string.isRequired,
      kycStatus: PropTypes.string.isRequired,
      transactionPattern: PropTypes.string.isRequired,
      flags: PropTypes.arrayOf(PropTypes.string),
      isMule: PropTypes.bool.isRequired
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default MuleAccountIdentificationInterface;