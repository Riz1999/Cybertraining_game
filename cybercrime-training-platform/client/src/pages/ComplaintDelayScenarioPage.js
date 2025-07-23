import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ComplaintDelayScenarioSimulation from '../components/simulation/complaint/ComplaintDelayScenarioSimulation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgress } from '../store/actions/progressActions';
import BadgeService from '../services/BadgeService';
import ModuleCompletion from '../components/modules/ModuleCompletion';

/**
 * ComplaintDelayScenarioPage
 * 
 * Page component for the complaint delay scenario simulation.
 * Part of Module 4: Escalation to FIR and CCTNS
 */
const ComplaintDelayScenarioPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showModuleCompletion, setShowModuleCompletion] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(null);
  const [badgeService] = useState(new BadgeService());
  const [moduleProgress, setModuleProgress] = useState(null);

  // Get user from Redux store
  const { user } = useSelector(state => state.auth);

  // Handle simulation completion
  const handleSimulationComplete = async (result) => {
    console.log('Simulation completed with result:', result);
    setSimulationComplete(true);
    setSimulationResult(result);

    // Update module progress if simulation was successful
    if (result.success && user) {
      const moduleId = 'module-4-escalation-fir';
      const activityId = 'complaint-delay-scenario';

      // Update activity progress
      dispatch(updateProgress({
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
        dispatch(updateProgress(moduleProgressData));
        setModuleProgress(moduleProgressData);
        
        // Check for badge eligibility
        try {
          const badgeResult = await badgeService.checkModule4BadgeEligibility(moduleProgressData);
          
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
    navigate('/modules/module-4-escalation-fir');
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
    navigate('/modules/module-5-analysis-evidence');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {showModuleCompletion ? (
          <ModuleCompletion
            module={{
              id: 'module-4-escalation-fir',
              title: 'Escalation to FIR and CCTNS',
              activities: [{ id: 'complaint-delay-scenario' }],
              minPassingScore: 80
            }}
            progress={moduleProgress}
            badge={badgeEarned}
            xp={{ earned: 200 }}
            nextModule={badgeService.getModule5Info()}
            onContinue={handleModuleContinue}
          />
        ) : showIntro ? (
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Complaint Delay Scenario</h1>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">
                  In this simulation, you will practice handling cases where complaints have been delayed in processing.
                  You&apos;ll need to analyze the timeline of events, understand the context, and make appropriate decisions
                  about when to escalate a complaint to an FIR and file it in the CCTNS system.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Objectives:</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Review the case timeline and understand the sequence of events</li>
                  <li>Identify critical points where action should have been taken</li>
                  <li>Make appropriate decisions about escalation to FIR</li>
                  <li>Understand when and why cases should be filed in CCTNS</li>
                  <li>Balance procedural requirements with victim needs</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Decision Making:</h2>
                <p className="mb-6">
                  You&apos;ll be presented with decision points where you must choose between:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Wait for more information:</strong> Appropriate when critical details are missing</li>
                  <li><strong>Escalate to FIR:</strong> Required when cases meet specific criteria or time thresholds</li>
                  <li><strong>File in CCTNS:</strong> Necessary for formal police investigation and legal proceedings</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Scoring:</h2>
                <p className="mb-6">
                  Your performance will be scored based on:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Decision Quality:</strong> Whether you made the appropriate decision at each point</li>
                  <li><strong>Timing:</strong> Whether you escalated at the right time (not too early or too late)</li>
                  <li><strong>Procedural Correctness:</strong> Whether you followed proper protocols</li>
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
                        <strong>Tip:</strong> In real-world scenarios, cybercrime complaints should typically be escalated to FIR
                        if there is no resolution within 15 days, or immediately if there is clear evidence of a serious offense.
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
                      <li>Timely escalation to FIR is critical for effective cybercrime investigation</li>
                      <li>CCTNS filing ensures proper documentation and legal follow-up</li>
                      <li>Understanding escalation criteria helps prioritize cases appropriately</li>
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
                              Badge Progress: FIR Specialist
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              You&apos;ve made progress toward earning the &quot;FIR Specialist&quot; badge by successfully completing this simulation!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-green-600">
                      This simulation demonstrates the importance of proper escalation procedures in cybercrime cases.
                      In real situations, timely FIR filing can significantly impact the investigation outcome.
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-red-800 mb-2">Areas for Improvement:</h3>
                    <ul className="list-disc pl-6 mb-4 space-y-1 text-red-700">
                      <li>Review the escalation criteria for cybercrime cases</li>
                      <li>Consider the time elapsed since the initial complaint</li>
                      <li>Evaluate the severity and evidence available in the case</li>
                    </ul>

                    <div className="text-sm text-red-600">
                      Don&apos;t worry! Understanding when to escalate cases takes prac
                      Try again to improve your decision-making skills.
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
          <ComplaintDelayScenarioSimulation onComplete={handleSimulationComplete} />
        )}
      </div>
    </Layout>
  );
};

export default ComplaintDelayScenarioPage;