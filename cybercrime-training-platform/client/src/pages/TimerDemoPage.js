import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TimedChallengeContainer from '../components/simulation/timer/TimedChallengeContainer';
import CountdownTimer from '../components/simulation/timer/CountdownTimer';
import TimePressureIndicator from '../components/simulation/timer/TimePressureIndicator';
import TimerResultAnimation from '../components/simulation/timer/TimerResultAnimation';

/**
 * TimerDemoPage - Demonstrates the timer components
 */
const TimerDemoPage = () => {
  const navigate = useNavigate();
  const [demoType, setDemoType] = useState('challenge');
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState('success');

  // Mock challenge component for demonstration
  const MockBankFreezeChallenge = ({ isActive, onComplete, trackAction }) => {
    const [step, setStep] = useState(1);
    const [selectedBank, setSelectedBank] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const handleNextStep = () => {
      if (trackAction) {
        trackAction('step_completed', { step, selectedBank, transactionId });
      }
      
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Complete the challenge with a score based on performance
        const accuracy = (selectedBank && transactionId) ? 0.9 : 0.6;
        if (onComplete) {
          onComplete(accuracy);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            🚨 Emergency: Fraudulent Transaction Detected
          </h3>
          <p className="text-red-700">
            A victim has reported unauthorized transfer of ₹75,000 from their account. 
            You must act quickly to freeze the transaction before it&apos;s processed.
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Step 1: Identify the Bank</h4>
            <p>Select the victim&apos;s bank from the list:</p>
            <select 
              className="w-full p-2 border rounded"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              disabled={!isActive}
            >
              <option value="">Select Bank...</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleNextStep}
              disabled={!isActive || !selectedBank}
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Step 2: Enter Transaction Details</h4>
            <p>Enter the transaction ID to freeze:</p>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Transaction ID (e.g., TXN123456789)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={!isActive}
            />
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              onClick={handleNextStep}
              disabled={!isActive || !transactionId}
            >
              Initiate Freeze
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Step 3: Confirm Freeze Request</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p><strong>Bank:</strong> {selectedBank.toUpperCase()}</p>
              <p><strong>Transaction ID:</strong> {transactionId}</p>
              <p><strong>Amount:</strong> ₹75,000</p>
            </div>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              onClick={handleNextStep}
              disabled={!isActive}
            >
              🔒 FREEZE TRANSACTION
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleChallengeComplete = (result) => {
    console.log('Challenge completed:', result);
    alert(`Challenge completed! Score: ${result.totalScore}% (${result.performanceLevel})`);
  };

  const handleShowResultDemo = (type) => {
    setResultType(type);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 5000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Timer Components Demo</h1>
          <button 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Demo Type Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Demo Type:</h2>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${demoType === 'challenge' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDemoType('challenge')}
            >
              Timed Challenge
            </button>
            <button
              className={`px-4 py-2 rounded ${demoType === 'timer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDemoType('timer')}
            >
              Basic Timer
            </button>
            <button
              className={`px-4 py-2 rounded ${demoType === 'pressure' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDemoType('pressure')}
            >
              Pressure Indicator
            </button>
            <button
              className={`px-4 py-2 rounded ${demoType === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDemoType('results')}
            >
              Result Animations
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {demoType === 'challenge' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Timed Challenge Demo</h2>
              <p className="text-gray-600 mb-6">
                This demonstrates a complete timed challenge scenario where officers must freeze a fraudulent transaction within a time limit.
              </p>
              
              <TimedChallengeContainer
                timeLimit={120} // 2 minutes
                title="Emergency Transaction Freeze"
                description="You have 2 minutes to freeze this fraudulent transaction. Work quickly but accurately!"
                autoStart={false}
                onComplete={handleChallengeComplete}
              >
                <MockBankFreezeChallenge />
              </TimedChallengeContainer>
            </div>
          )}

          {demoType === 'timer' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Basic Timer Demo</h2>
              <p className="text-gray-600 mb-6">
                This shows the basic countdown timer with different configurations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Normal Timer</h3>
                  <CountdownTimer
                    duration={60}
                    onComplete={() => alert('Timer completed!')}
                    autoStart={false}
                    size="medium"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Urgent Timer</h3>
                  <CountdownTimer
                    duration={30}
                    onComplete={() => alert('Urgent timer completed!')}
                    autoStart={false}
                    size="medium"
                    variant="urgent"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Critical Timer</h3>
                  <CountdownTimer
                    duration={15}
                    onComplete={() => alert('Critical timer completed!')}
                    autoStart={false}
                    size="medium"
                    variant="critical"
                  />
                </div>
              </div>
            </div>
          )}

          {demoType === 'pressure' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Time Pressure Indicator Demo</h2>
              <p className="text-gray-600 mb-6">
                This shows how the pressure indicator changes as time runs out.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Normal (60%)</h3>
                  <TimePressureIndicator
                    timeLeft={72}
                    totalTime={120}
                    showAlerts={true}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Warning (20%)</h3>
                  <TimePressureIndicator
                    timeLeft={24}
                    totalTime={120}
                    showAlerts={true}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Critical (5%)</h3>
                  <TimePressureIndicator
                    timeLeft={6}
                    totalTime={120}
                    showAlerts={true}
                  />
                </div>
              </div>
            </div>
          )}

          {demoType === 'results' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Result Animation Demo</h2>
              <p className="text-gray-600 mb-6">
                Click the buttons below to see different result animations.
              </p>
              
              <div className="flex space-x-4 mb-6">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleShowResultDemo('success')}
                >
                  Show Success
                </button>
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  onClick={() => handleShowResultDemo('excellent')}
                >
                  Show Excellent
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleShowResultDemo('timeout')}
                >
                  Show Timeout
                </button>
              </div>

              {showResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <TimerResultAnimation
                    result={resultType}
                    scoreData={{
                      totalScore: resultType === 'excellent' ? 95 : resultType === 'success' ? 78 : 0,
                      performanceLevel: resultType === 'excellent' ? 'Exceptional' : resultType === 'success' ? 'Good' : 'Incomplete',
                      timeMetrics: {
                        timeUsed: resultType === 'timeout' ? 120 : 45,
                        timeLimit: 120
                      },
                      breakdown: {
                        speed: resultType === 'excellent' ? 95 : 70,
                        accuracy: resultType === 'excellent' ? 100 : 85
                      },
                      bonus: resultType === 'excellent' ? {
                        hadBonus: true,
                        bonusPoints: 10,
                        bonusReason: 'Lightning Fast Completion'
                      } : undefined
                    }}
                    onAnimationComplete={() => setShowResult(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use Timer Components</h3>
          <div className="text-blue-700 space-y-2">
            <p><strong>TimedChallengeContainer:</strong> Wraps any challenge with a timer and scoring system</p>
            <p><strong>CountdownTimer:</strong> Basic countdown timer with visual progress and controls</p>
            <p><strong>TimePressureIndicator:</strong> Shows urgency levels as time runs out</p>
            <p><strong>TimerResultAnimation:</strong> Animated feedback for challenge completion</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimerDemoPage;