import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

/**
 * TransactionFreezeResult component
 * 
 * This component displays an animated result of a transaction freeze request,
 * showing either success or failure with appropriate animations.
 */
const TransactionFreezeResult = ({ 
  result, 
  onRetry, 
  onContinue 
}) => {
  const [animationStage, setAnimationStage] = useState('initial'); // 'initial', 'processing', 'result'
  const [showDetails, setShowDetails] = useState(false);

  // Start animation sequence when component mounts
  useEffect(() => {
    const animationSequence = async () => {
      // Initial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Processing animation
      setAnimationStage('processing');
      
      // Result animation after processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnimationStage('result');
      
      // Show details after result animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowDetails(true);
    };
    
    animationSequence();
  }, []);

  // Determine animation classes based on result and animation stage
  const getAnimationClasses = () => {
    if (animationStage === 'initial') {
      return 'opacity-0 scale-95';
    }
    
    if (animationStage === 'processing') {
      return 'opacity-100 scale-100';
    }
    
    return result.success 
      ? 'opacity-100 scale-100 border-green-300 bg-green-50' 
      : 'opacity-100 scale-100 border-red-300 bg-red-50';
  };

  // Render the appropriate icon based on result and animation stage
  const renderIcon = () => {
    if (animationStage === 'processing') {
      return (
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      );
    }
    
    if (result.success) {
      return (
        <div className="animate-bounce-in">
          <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="animate-bounce-in">
        <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
    );
  };

  // Render the appropriate title based on result and animation stage
  const renderTitle = () => {
    if (animationStage === 'processing') {
      return "Processing Freeze Request...";
    }
    
    if (result.success) {
      return "Transaction Freeze Successful";
    }
    
    return "Transaction Freeze Failed";
  };

  // Render the appropriate message based on result and animation stage
  const renderMessage = () => {
    if (animationStage === 'processing') {
      return "Contacting bank API and submitting freeze request...";
    }
    
    return result.message || (result.success 
      ? "The funds have been successfully frozen. The bank has been notified and will take further action."
      : "The freeze request failed. The funds may have already been withdrawn or transferred.");
  };

  // Render animated bank response visualization
  const renderBankResponse = () => {
    if (animationStage !== 'result') {
      return null;
    }

    return (
      <div className={`mt-6 p-4 rounded-lg border ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <h3 className="font-medium text-lg mb-2">Bank Response:</h3>
        <div className="font-mono text-sm p-3 bg-black text-green-400 rounded overflow-hidden">
          <div className="typewriter-text">
            {result.success ? (
              <>
                &gt; Connecting to bank API...<br />
                &gt; Authentication successful<br />
                &gt; Submitting freeze request for UTR: {result.utr || 'UTR123456789'}<br />
                &gt; Request processing...<br />
                &gt; <span className="text-green-300 font-bold">FREEZE_SUCCESSFUL</span><br />
                &gt; Transaction locked. Funds secured.<br />
                &gt; Case reference: {result.caseRef || `CASE-${Math.floor(Math.random() * 1000000)}`}
              </>
            ) : (
              <>
                &gt; Connecting to bank API...<br />
                &gt; Authentication successful<br />
                &gt; Submitting freeze request for UTR: {result.utr || 'UTR123456789'}<br />
                &gt; Request processing...<br />
                &gt; <span className="text-red-400 font-bold">FREEZE_FAILED</span><br />
                &gt; Error: {result.reason === 'time_expired' 
                  ? 'Transaction window expired. Funds already transferred.' 
                  : 'Invalid transaction details or insufficient permissions.'}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render animated transaction flow visualization
  const renderTransactionFlow = () => {
    if (animationStage !== 'result' || !showDetails) {
      return null;
    }

    return (
      <div className="mt-6 overflow-hidden">
        <h3 className="font-medium text-lg mb-4">Transaction Flow Visualization:</h3>
        <div className="relative h-24 flex items-center justify-center">
          {/* Sender Bank */}
          <div className="absolute left-0 top-0 w-20 h-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-2xl">🏦</span>
            </div>
            <span className="text-xs text-center">Sender Bank</span>
          </div>
          
          {/* Recipient Bank */}
          <div className="absolute right-0 top-0 w-20 h-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
              <span className="text-2xl">🏦</span>
            </div>
            <span className="text-xs text-center">Recipient Bank</span>
          </div>
          
          {/* Transaction Flow Arrow */}
          <div className="w-full px-24 relative">
            <div className="h-2 bg-gray-300 rounded-full"></div>
            
            {/* Transaction Marker */}
            <div className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center
              ${result.success 
                ? 'bg-red-500 transaction-frozen' 
                : 'bg-green-500 transaction-completed'}`}
              style={{
                left: result.success ? '40%' : '100%',
                marginLeft: '-12px',
                transition: 'left 2s ease-in-out'
              }}
            >
              <span className="text-white text-xs">₹</span>
            </div>
            
            {/* Freeze Point Marker */}
            {result.success && (
              <div className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 border-2 border-red-500 rounded-full"
                style={{ left: '40%', marginLeft: '-12px' }}>
                <div className="absolute -top-8 whitespace-nowrap text-xs font-medium text-red-600">
                  Freeze Point
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction Status Text */}
        <div className={`text-center mt-4 font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success 
            ? 'Transaction successfully frozen before completion' 
            : 'Transaction completed before freeze request was processed'}
        </div>
      </div>
    );
  };

  // Render performance metrics
  const renderPerformanceMetrics = () => {
    if (!showDetails) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className={`rounded-lg p-4 shadow-sm ${
          result.success ? 'bg-white' : 'bg-red-50'
        }`}>
          <div className="text-sm text-gray-500 mb-1">Score</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.totalScore || 0}%
          </div>
        </div>
        
        <div className={`rounded-lg p-4 shadow-sm ${
          result.success ? 'bg-white' : 'bg-red-50'
        }`}>
          <div className="text-sm text-gray-500 mb-1">Time Used</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.timeUsed ? Math.round(result.timeUsed) : 0}s
          </div>
        </div>
        
        <div className={`rounded-lg p-4 shadow-sm ${
          result.success ? 'bg-white' : 'bg-red-50'
        }`}>
          <div className="text-sm text-gray-500 mb-1">Accuracy</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.accuracy !== undefined ? Math.round(result.accuracy * 100) : 0}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`transition-all duration-500 ${getAnimationClasses()}`}>
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            {renderIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            {renderTitle()}
          </h2>
          
          <p className="text-center text-gray-700 mb-6 max-w-lg">
            {renderMessage()}
          </p>
          
          {renderBankResponse()}
          
          {renderTransactionFlow()}
          
          {renderPerformanceMetrics()}
          
          {showDetails && (
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
              {!result.success && (
                <Button
                  variant="outline"
                  onClick={onRetry}
                >
                  Try Again
                </Button>
              )}
              
              <Button
                variant="primary"
                onClick={onContinue}
              >
                {result.success ? 'Continue' : 'Return to Module'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

TransactionFreezeResult.propTypes = {
  result: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    reason: PropTypes.string,
    timeUsed: PropTypes.number,
    totalScore: PropTypes.number,
    accuracy: PropTypes.number,
    message: PropTypes.string,
    utr: PropTypes.string,
    caseRef: PropTypes.string
  }).isRequired,
  onRetry: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default TransactionFreezeResult;