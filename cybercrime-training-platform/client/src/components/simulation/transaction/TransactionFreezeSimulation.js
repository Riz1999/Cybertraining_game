import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import BankInfoLookup from './BankInfoLookup';
import CharacterAvatar from '../dialog/CharacterAvatar';
import TransactionFreezeResult from './TransactionFreezeResult';

/**
 * TransactionFreezeSimulation component
 * 
 * This component implements the transaction freeze simulation for Module 3.
 * It includes a complaint scenario, bank information lookup, and transaction freeze request.
 */
const TransactionFreezeSimulation = ({ onComplete }) => {
  // Simulation states
  const [stage, setStage] = useState('complaint'); // 'complaint', 'lookup', 'request', 'result'
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  
  // Generate mock complaint data
  const generateComplaintData = useCallback(() => {
    const banks = ['sbi', 'hdfc', 'icici', 'axis', 'pnb'];
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    
    const victimNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Verma', 'Vikram Singh'];
    const victimName = victimNames[Math.floor(Math.random() * victimNames.length)];
    
    const fraudsterNames = ['John Smith', 'Alex Wilson', 'Michael Brown', 'David Jones', 'Robert Taylor'];
    const fraudsterName = fraudsterNames[Math.floor(Math.random() * fraudsterNames.length)];
    
    const amount = Math.floor(10000 + Math.random() * 90000);
    const utrNumber = `UTR${Math.floor(Math.random() * 1000000000)}`;
    const currentDate = new Date();
    const transactionDate = currentDate.toISOString().split('T')[0];
    
    return {
      id: `COMP${Math.floor(Math.random() * 10000)}`,
      title: 'Online Banking Fraud Report',
      description: `I, ${victimName}, would like to report a fraudulent transaction from my bank account. I received a call from someone claiming to be from my bank's security team. They convinced me to share my OTP for verification purposes. Shortly after, I noticed a transaction of ₹${amount.toLocaleString('en-IN')} was made from my account without my authorization.`,
      victim: {
        name: victimName,
        phone: `+91 ${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        email: `${victimName.toLowerCase().replace(' ', '.')}@email.com`,
        emotionalState: 'distressed'
      },
      transactions: [
        {
          id: `TXN${Math.floor(Math.random() * 10000)}`,
          utr: utrNumber,
          amount: amount,
          date: transactionDate,
          sender: victimName,
          recipient: fraudsterName,
          bank: randomBank
        }
      ]
    };
  }, []);
  
  // Initialize complaint data
  useEffect(() => {
    setComplaintData(generateComplaintData());
  }, [generateComplaintData]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    
    if (isTimerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time's up - handle failure
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, timeRemaining]);
  
  // Handle time up (failure)
  const handleTimeUp = () => {
    setIsTimerActive(false);
    setStage('result');
    
    const endTime = Date.now();
    const timeUsed = startTime ? (endTime - startTime) / 1000 : 180;
    
    setSimulationResult({
      success: false,
      reason: 'time_expired',
      timeUsed,
      totalScore: 0,
      accuracy: 0,
      message: 'Time expired before the transaction could be frozen. In cybercrime cases, quick action is critical.'
    });
  };
  
  // Start the simulation
  const handleStartSimulation = () => {
    setIsTimerActive(true);
    setStartTime(Date.now());
    setStage('lookup');
  };
  
  // Handle when bank and transaction info is found
  const handleInfoFound = (info) => {
    setSelectedInfo(info);
    setStage('request');
  };
  
  // Submit freeze request
  const handleSubmitFreezeRequest = () => {
    if (!selectedInfo) return;
    
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const endTime = Date.now();
      const timeUsed = startTime ? (endTime - startTime) / 1000 : 180;
      const timeScore = Math.max(0, Math.min(100, (1 - timeUsed / 180) * 100));
      
      // Check if correct bank was selected
      const isCorrectBank = selectedInfo.bank.id === complaintData.transactions[0].bank;
      
      // Check if correct transaction was selected
      const isCorrectTransaction = selectedInfo.transaction.id === complaintData.transactions[0].id ||
                                  selectedInfo.transaction.utr === complaintData.transactions[0].utr;
      
      const accuracy = isCorrectBank && isCorrectTransaction ? 1 : 
                      (isCorrectBank || isCorrectTransaction ? 0.5 : 0);
      
      // Calculate total score
      const totalScore = Math.round((timeScore * 0.6) + (accuracy * 100 * 0.4));
      
      setSimulationResult({
        success: accuracy > 0,
        reason: accuracy === 0 ? 'wrong_info' : (timeRemaining < 30 ? 'barely_made_it' : 'success'),
        timeUsed,
        totalScore,
        accuracy,
        message: accuracy === 0 
          ? 'The freeze request failed because incorrect information was provided.'
          : (timeRemaining < 30 
              ? 'The freeze request was successful, but it was very close to the deadline.'
              : 'The freeze request was successful! The funds have been frozen.')
      });
      
      setIsTimerActive(false);
      setIsProcessing(false);
      setStage('result');
      
      // Notify parent component
      onComplete({
        success: accuracy > 0,
        timeUsed,
        totalScore,
        accuracy
      });
    }, 2000);
  };
  
  // Render complaint stage
  const renderComplaintStage = () => (
    <Card className="mb-4">
      <div className="p-6">
        <div className="flex items-start mb-6">
          <div className="mr-4">
            {complaintData?.victim && (
              <CharacterAvatar 
                character={{
                  name: complaintData.victim.name,
                  emotionalState: complaintData.victim.emotionalState
                }}
                size="lg"
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{complaintData?.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>Complaint ID: {complaintData?.id}</span>
              <span className="mx-2">•</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none">
              <p>{complaintData?.description}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Time-Critical Alert:</strong> This transaction was reported within the last 24 hours and may still be recoverable.
                Quick action is required to freeze the funds before they are withdrawn.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Victim Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {complaintData?.victim?.name}</p>
              <p><strong>Phone:</strong> {complaintData?.victim?.phone}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {complaintData?.victim?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Transaction Details:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR/Ref</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaintData?.transactions?.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.utr}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{transaction.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.sender}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.recipient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartSimulation}
          >
            Start Transaction Freeze Process
          </Button>
        </div>
      </div>
    </Card>
  );
  
  // Render lookup stage
  const renderLookupStage = () => (
    <>
      <Card className="mb-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Freeze Process</h2>
          <div className="prose max-w-none mb-4">
            <p>
              To freeze the transaction, you need to identify the correct bank and transaction details.
              Use the lookup tool below to search for the bank&apos;s API and the transaction UTR number.
            </p>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Remember:</strong> You need to find both the correct bank API and the transaction UTR number to successfully freeze the transaction.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">How to Use the Lookup Tool:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>First, search for the <strong>bank information</strong> using the bank name mentioned in the complaint</li>
              <li>Select the correct bank from the search results to view its API details</li>
              <li>Switch to <strong>Transaction/UTR</strong> search to find the specific transaction</li>
              <li>Search using the UTR number or transaction details from the complaint</li>
              <li>Select the correct transaction from the results</li>
              <li>Once you have both bank and transaction information, you can submit the freeze request</li>
            </ol>
            <p className="mt-3 text-sm text-gray-600">
              <strong>Time is critical!</strong> In real-world scenarios, banks have a limited window (typically 24-48 hours) 
              to freeze transactions. The faster you act, the higher the chances of recovery.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="mb-4 lg:mb-0">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Complaint Summary</h3>
            <div className="prose max-w-none">
              <p>{complaintData?.description}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Transaction Details:</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                {complaintData?.transactions?.map(transaction => (
                  <div key={transaction.id}>
                    <p><strong>Amount:</strong> ₹{transaction.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Date:</strong> {transaction.date}</p>
                    <p><strong>Sender:</strong> {transaction.sender}</p>
                    <p><strong>Recipient:</strong> {transaction.recipient}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        <BankInfoLookup
          complaintData={complaintData}
          onInfoFound={handleInfoFound}
          timeRemaining={timeRemaining}
          isActive={isTimerActive}
        />
      </div>
    </>
  );
  
  // Render request stage
  const renderRequestStage = () => (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Freeze Request</h2>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-green-800 mb-2">Information Found:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🏦</span>
                <span className="font-bold">{selectedInfo?.bank?.name}</span>
              </div>
              <p><strong>API Endpoint:</strong> {selectedInfo?.bank?.apiEndpoint}</p>
              <p><strong>Freeze Window:</strong> {selectedInfo?.bank?.freezeWindow || '24-48 hours'}</p>
              <p><strong>Contact:</strong> {selectedInfo?.bank?.contactInfo || 'Toll-free helpline'}</p>
            </div>
            <div>
              <p className="font-bold mb-2">{selectedInfo?.transaction?.utr || selectedInfo?.transaction?.id}</p>
              <p><strong>Amount:</strong> ₹{selectedInfo?.transaction?.amount.toLocaleString('en-IN')}</p>
              <p><strong>Date:</strong> {selectedInfo?.transaction?.date}</p>
              <p><strong>Sender:</strong> {selectedInfo?.transaction?.sender}</p>
              <p><strong>Recipient:</strong> {selectedInfo?.transaction?.recipient}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Required Information for Freeze Request:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ul className="list-disc list-inside">
                {selectedInfo?.bank?.requiredInfo?.map((info, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    {info} <span className="text-green-600">✓</span>
                  </li>
                )) || (
                  <>
                    <li className="text-sm text-yellow-700">UTR Number <span className="text-green-600">✓</span></li>
                    <li className="text-sm text-yellow-700">Transaction Date <span className="text-green-600">✓</span></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> All required information has been collected. The freeze request is ready to be submitted.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Time Remaining:</strong> {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Submit the freeze request immediately to maximize chances of recovery.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitFreezeRequest}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              'Submit Freeze Request'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
  
  // Render result stage
  const renderResultStage = () => {
    // Add UTR and case reference to the result for the animation
    const enhancedResult = {
      ...simulationResult,
      utr: complaintData?.transactions?.[0]?.utr || 'UTR123456789',
      caseRef: `CASE-${Math.floor(Math.random() * 1000000)}`
    };
    
    // Handle retry button click
    const handleRetry = () => {
      // Reset simulation state
      setTimeRemaining(180);
      setSelectedInfo(null);
      setSimulationResult(null);
      setStage('complaint');
      setComplaintData(generateComplaintData());
    };
    
    // Handle continue button click (same as parent's onComplete)
    const handleContinue = () => {
      // The parent component already receives the onComplete call when setting the result
      // This is just for the button in the animation component
    };
    
    return (
      <TransactionFreezeResult
        result={enhancedResult}
        onRetry={handleRetry}
        onContinue={() => onComplete(enhancedResult)}
      />
    );
  };
  
  // Render the current stage
  const renderStage = () => {
    switch (stage) {
      case 'complaint':
        return renderComplaintStage();
      case 'lookup':
        return renderLookupStage();
      case 'request':
        return renderRequestStage();
      case 'result':
        return renderResultStage();
      default:
        return null;
    }
  };
  
  return (
    <div className="transaction-freeze-simulation">
      {renderStage()}
    </div>
  );
};

TransactionFreezeSimulation.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default TransactionFreezeSimulation;