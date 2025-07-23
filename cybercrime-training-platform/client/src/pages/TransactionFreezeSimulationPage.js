import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TransactionFreezeSimulation from '../components/simulation/transaction/TransactionFreezeSimulation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgress } from '../store/actions/progressActions';
import BadgeService from '../services/BadgeService';
import ModuleCompletion from '../components/modules/ModuleCompletion';

/**
 * TransactionFreezeSimulationPage
 * 
 * Page component for the transaction freeze simulation.
 * Part of Module 3: Time-Critical Response
 */
const TransactionFreezeSimulationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showModuleCompletion, setShowModuleCompletion] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(null);
  const [badgeService] = useState(new BadgeService());
  const [moduleProgress, setModuleProgress] = useState(null);

  // Get user progress from Redux store
  const { user } = useSelector(state => state.auth);
  const { progress } = useSelector(state => state.progress);

  // Handle simulation completion
  const handleSimulationComplete = async (result) => {
    console.log('Simulation completed with result:', result);
    setSimulationComplete(true);
    setSimulationResult(result);

    // Update module progress if simulation was successful
    if (result.success && user) {
      const moduleId = 'module-3-time-critical-response';
      const activityId = 'transaction-freeze-simulation';

      // Update activity progress
      await dispatch(updateProgress({
        userId: user.id,
        moduleId,
        activityId,
        status: 'completed',
        score: result.totalScore,
        timeSpent: result.timeUsed
      }));
      
      // If score is high enough, mark the module as completed
      if (result.totalScore >= 80) {
        const moduleProgressData = {
          moduleId,
          status: 'completed',
          currentScore: result.totalScore,
          timeSpent: result.timeUsed
        };
        
        // Update module progress
        await dispatch(updateProgress(moduleProgressData));
        setModuleProgress(moduleProgressData);
        
        // Check for badge eligibility
        try {
          const badgeResult = await badgeService.checkModule3BadgeEligibility(moduleProgressData);
          
          if (badgeResult.eligible) {
            setBadgeEarned(badgeResult.badge);
            
            // If this is a new badge, show the module completion screen
            if (badgeResult.isNewBadge) {
              setShowModuleCompletion(true);
            }
          }
        } catch (error) {
          console.error('Error checking badge eligibility:', error);
        }
      }
    }
  };

  // Handle starting the simulation
  const handleStartSimulation = () => {
    setShowIntro(false);
  };

  // Handle returning to module
  const handleReturnToModule = () => {
    navigate('/modules/module-3-time-critical-response');
  };

  // Handle trying again
  const handleTryAgain = () => {
    setShowIntro(true);
    setSimulationComplete(false);
    setSimulationResult(null);
  };

  // Determine if the user has earned the badge
  const hasEarnedBadge = () => {
    if (!simulationResult || !simulationResult.success) return false;
    return simulationResult.totalScore >= 70;
  };

  // Handle module completion continue
  const handleModuleContinue = () => {
    setShowModuleCompletion(false);
    navigate('/modules/module-4-escalation-fir');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {showModuleCompletion ? (
          <ModuleCompletion
            module={{
              id: 'module-3-time-critical-response',
              title: 'Time-Critical Response: Transaction Freezing',
              activities: [{ id: 'transaction-freeze-simulation' }],
              minPassingScore: 80
            }}
            progress={moduleProgress}
            badge={badgeEarned}
            xp={{ earned: 200 }}
            nextModule={badgeService.getModule4Info()}
            onContinue={handleModuleContinue}
          />
        ) : showIntro ? (
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Transaction Freeze Simulation</h1>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  In this simulation, you will practice the time-critical process of freezing fraudulent transactions
                  before the funds are lost. You&apos;ll need to quickly identify key information and submit freeze
                  requests within strict time limits.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Objectives:</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Identify the correct bank details from the complaint</li>
                  <li>Locate the transaction ID for the freeze request</li>
                  <li>Select the appropriate API for the bank</li>
                  <li>Submit the freeze request before the time window closes</li>
                  <li>Verify the freeze was successful</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Time Pressure:</h2>
                <p className="mb-6">
                  You&apos;ll have a limited time window to complete the freeze request. The faster you act, the higher
                  your chances of success. Remember that in real situations, every second counts when trying to
                  recover fraudulent transactions.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Scoring:</h2>
                <p className="mb-6">
                  Your performance will be scored based on:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Speed:</strong> How quickly you complete the freeze request</li>
                  <li><strong>Accuracy:</strong> Whether you selected the correct information</li>
                  <li><strong>Completeness:</strong> Whether you completed all required steps</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Tip:</strong> In real-world scenarios, banks typically have a 24-48 hour window to freeze transactions,
                        but the sooner you act, the higher the chances of recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleStartSimulation}
                  variant="primary"
                  size="lg"
                  className="px-8"
                >
                  Start Simulation
                </Button>
              </div>
            </div>
          </Card>
        ) : simulationComplete ? (
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Simulation {simulationResult?.success ? 'Complete' : 'Failed'}
              </h1>

              <div className={`border rounded-lg p-6 mb-6 ${simulationResult?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                <h2 className={`text-xl font-semibold mb-3 ${simulationResult?.success ? 'text-green-800' : 'text-red-800'
                  }`}>Your Performance</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {simulationResult?.totalScore || 0}%
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Time Used</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {simulationResult?.timeUsed ? Math.round(simulationResult.timeUsed) : 0}s
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {simulationResult?.accuracy !== undefined ? Math.round(simulationResult.accuracy * 100) : 0}%
                    </div>
                  </div>
                </div>

                {simulationResult?.success ? (
                  <>
                    <h3 className="font-semibold text-green-800 mb-2">Key Learnings:</h3>
                    <ul className="list-disc pl-6 mb-4 space-y-1 text-green-700">
                      <li>Quick identification of transaction details is critical</li>
                      <li>Selecting the correct bank API ensures successful freezes</li>
                      <li>Time pressure management is essential for cybercrime response</li>
                    </ul>

                    {hasEarnedBadge() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-medium text-yellow-800">
                              Badge Progress: Digital Defender
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              You&apos;ve made progress toward earning the &quot;Digital Defender&quot; badge by successfully completing this simulation!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-green-600">
                      This simulation demonstrates the importance of rapid response in cybercrime cases.
                      In real situations, every minute counts when trying to recover fraudulent transactions.
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-red-800 mb-2">Areas for Improvement:</h3>
                    <ul className="list-disc pl-6 mb-4 space-y-1 text-red-700">
                      <li>Ensure you identify the correct bank information</li>
                      <li>Locate the exact transaction UTR number</li>
                      <li>Work quickly but accurately to beat the time limit</li>
                    </ul>

                    <div className="text-sm text-red-600">
                      Don&apos;t worry! In real-world scenarios, you would have support from senior officers.
                      Try again to improve your skills and response time.
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  size="lg"
                >
                  Try Again
                </Button>

                <Button
                  onClick={handleReturnToModule}
                  variant="primary"
                  size="lg"
                >
                  Return to Module
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <TransactionFreezeSimulation onComplete={handleSimulationComplete} />
        )}
      </div>
    </Layout>
  );
};

export default TransactionFreezeSimulationPage;