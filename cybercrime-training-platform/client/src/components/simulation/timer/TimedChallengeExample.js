import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimedChallengeContainer from './TimedChallengeContainer';

/**
 * BankFreezeChallenge component
 * 
 * Example timed challenge simulating the urgent process of freezing
 * a bank account after a cybercrime complaint.
 */
const BankFreezeChallenge = ({
  isActive,
  timeLeft,
  onComplete,
  trackAction,
  challengeState
}) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [freezeReason, setFreezeReason] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Sample data
  const banks = [
    { id: 'sbi', name: 'State Bank of India', hotline: '1800-11-2211' },
    { id: 'hdfc', name: 'HDFC Bank', hotline: '1800-202-6161' },
    { id: 'icici', name: 'ICICI Bank', hotline: '1800-200-3344' },
    { id: 'axis', name: 'Axis Bank', hotline: '1800-419-5959' },
    { id: 'pnb', name: 'Punjab National Bank', hotline: '1800-180-2222' }
  ];

  const freezeReasons = [
    'Fraudulent transaction reported',
    'Unauthorized access suspected',
    'Cybercrime complaint filed',
    'Victim request for account freeze'
  ];

  // Track user actions
  useEffect(() => {
    if (selectedBank && trackAction) {
      trackAction('bank_selected', { bank: selectedBank });
    }
  }, [selectedBank, trackAction]);

  useEffect(() => {
    if (currentStep && trackAction) {
      trackAction('step_change', { step: currentStep });
    }
  }, [currentStep, trackAction]);

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!selectedBank) newErrors.bank = 'Please select a bank';
        if (!accountNumber) newErrors.account = 'Account number is required';
        if (!utrNumber) newErrors.utr = 'UTR number is required';
        break;
      case 2:
        if (!contactMethod) newErrors.contact = 'Please select contact method';
        break;
      case 3:
        if (!freezeReason) newErrors.reason = 'Please select freeze reason';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        if (trackAction) {
          trackAction('step_completed', { step: currentStep });
        }
      } else {
        handleComplete();
      }
    }
  };

  // Handle challenge completion
  const handleComplete = () => {
    const accuracy = calculateAccuracy();
    if (onComplete) {
      onComplete(accuracy, {
        stepsCompleted: currentStep,
        totalSteps: 4,
        selectedBank,
        accountNumber,
        utrNumber,
        contactMethod,
        freezeReason
      });
    }
  };

  // Calculate accuracy based on correct selections
  const calculateAccuracy = () => {
    let correctAnswers = 0;
    let totalQuestions = 4;

    // Check if correct bank was selected (any bank is acceptable)
    if (selectedBank) correctAnswers++;
    
    // Check if account number format is correct (simplified validation)
    if (accountNumber && accountNumber.length >= 10) correctAnswers++;
    
    // Check if UTR format is correct (simplified validation)
    if (utrNumber && utrNumber.length >= 12) correctAnswers++;
    
    // Check if appropriate contact method was selected
    if (contactMethod === 'hotline') correctAnswers++;

    return correctAnswers / totalQuestions;
  };

  // Get selected bank details
  const selectedBankDetails = banks.find(bank => bank.id === selectedBank);

  return (
    <div className="bank-freeze-challenge">
      {/* Challenge header */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🚨</div>
          <div>
            <h2 className="text-lg font-bold text-red-800">URGENT: Bank Account Freeze Required</h2>
            <p className="text-red-700">
              A victim has reported fraudulent transactions. You must freeze the suspect's account immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {/* Step 1: Bank and Account Details */}
        {currentStep >= 1 && (
          <div className={`p-4 border rounded-lg ${currentStep === 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                currentStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                1
              </span>
              Identify Target Bank and Account
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank *
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  disabled={currentStep > 1}
                  className={`w-full p-3 border rounded-lg ${errors.bank ? 'border-red-300' : 'border-gray-300'} ${
                    currentStep > 1 ? 'bg-gray-100' : ''
                  }`}
                >
                  <option value="">Choose a bank...</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
                {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={currentStep > 1}
                  placeholder="Enter account number"
                  className={`w-full p-3 border rounded-lg ${errors.account ? 'border-red-300' : 'border-gray-300'} ${
                    currentStep > 1 ? 'bg-gray-100' : ''
                  }`}
                />
                {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTR/Transaction Reference *
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  disabled={currentStep > 1}
                  placeholder="Enter UTR or transaction reference number"
                  className={`w-full p-3 border rounded-lg ${errors.utr ? 'border-red-300' : 'border-gray-300'} ${
                    currentStep > 1 ? 'bg-gray-100' : ''
                  }`}
                />
                {errors.utr && <p className="text-red-500 text-sm mt-1">{errors.utr}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Method */}
        {currentStep >= 2 && (
          <div className={`p-4 border rounded-lg ${currentStep === 2 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                currentStep > 2 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                2
              </span>
              Choose Contact Method
            </h3>

            {selectedBankDetails && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>{selectedBankDetails.name}</strong> - Hotline: {selectedBankDetails.hotline}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {[
                { id: 'hotline', label: 'Bank Hotline (Fastest)', recommended: true },
                { id: 'branch', label: 'Visit Branch', recommended: false },
                { id: 'email', label: 'Email Request', recommended: false },
                { id: 'online', label: 'Online Portal', recommended: false }
              ].map(method => (
                <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method.id}
                    checked={contactMethod === method.id}
                    onChange={(e) => setContactMethod(e.target.value)}
                    disabled={currentStep > 2}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className={`${method.recommended ? 'font-medium text-green-700' : ''}`}>
                    {method.label}
                    {method.recommended && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">RECOMMENDED</span>}
                  </span>
                </label>
              ))}
            </div>
            {errors.contact && <p className="text-red-500 text-sm mt-2">{errors.contact}</p>}
          </div>
        )}

        {/* Step 3: Freeze Reason */}
        {currentStep >= 3 && (
          <div className={`p-4 border rounded-lg ${currentStep === 3 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                currentStep > 3 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                3
              </span>
              Specify Freeze Reason
            </h3>

            <div className="space-y-3">
              {freezeReasons.map((reason, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="freezeReason"
                    value={reason}
                    checked={freezeReason === reason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    disabled={currentStep > 3}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {errors.reason && <p className="text-red-500 text-sm mt-2">{errors.reason}</p>}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep >= 4 && (
          <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              Confirm Freeze Request
            </h3>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-medium mb-3">Request Summary:</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Bank:</strong> {selectedBankDetails?.name}</div>
                <div><strong>Account:</strong> {accountNumber}</div>
                <div><strong>UTR:</strong> {utrNumber}</div>
                <div><strong>Contact Method:</strong> {contactMethod}</div>
                <div><strong>Reason:</strong> {freezeReason}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || challengeState !== 'active'}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={handleNextStep}
          disabled={challengeState !== 'active'}
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            currentStep === 4 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {currentStep === 4 ? 'Submit Freeze Request' : 'Next Step'}
        </button>
      </div>

      {/* Time pressure warning */}
      {timeLeft <= 30 && challengeState === 'active' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-xl animate-pulse">⚠️</span>
            <span className="text-red-800 font-medium">
              Critical: Only {timeLeft} seconds remaining! Every second counts in fraud prevention.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * TimedChallengeExample component
 * 
 * Example implementation showing how to use the timed challenge system.
 */
const TimedChallengeExample = () => {
  const [results, setResults] = useState(null);

  const handleChallengeComplete = (scoreData) => {
    setResults(scoreData);
    console.log('Challenge completed:', scoreData);
  };

  const handleTimeUp = (scoreData) => {
    setResults(scoreData);
    console.log('Time up:', scoreData);
  };

  return (
    <div className="timed-challenge-example">
      <TimedChallengeContainer
        timeLimit={120} // 2 minutes
        title="Emergency Bank Account Freeze"
        description="Respond to a cybercrime complaint by freezing the suspect's bank account within the time limit"
        onComplete={handleChallengeComplete}
        onTimeUp={handleTimeUp}
        autoStart={false}
        scoringWeights={{
          completion: 0.5,
          speed: 0.3,
          accuracy: 0.2
        }}
      >
        <BankFreezeChallenge />
      </TimedChallengeContainer>

      {/* Results display (for development) */}
      {results && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
          <h3 className="font-bold mb-2">Challenge Results</h3>
          <div className="text-sm space-y-1">
            <div>Score: {results.totalScore}%</div>
            <div>Performance: {results.performanceLevel}</div>
            <div>Time Used: {Math.round(results.timeMetrics?.timeUsed || 0)}s</div>
            {results.bonus?.hadBonus && (
              <div className="text-green-600">Bonus: +{results.bonus.bonusPoints}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

BankFreezeChallenge.propTypes = {
  isActive: PropTypes.bool,
  timeLeft: PropTypes.number,
  onComplete: PropTypes.func,
  trackAction: PropTypes.func,
  challengeState: PropTypes.string
};

export default TimedChallengeExample;