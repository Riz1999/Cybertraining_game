import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ComplaintDelayScenarioSimulation from '../simulation/complaint/ComplaintDelayScenarioSimulation';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgress } from '../../store/actions/progressActions';

/**
 * ComplaintDelayScenarioModule
 * 
 * Module component for the complaint delay scenario.
 * This component is used in the ModuleDetailPage to display the complaint delay scenario.
 */
const ComplaintDelayScenarioModule = ({ activity, onComplete }) => {
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Get user from Redux store
  const { user } = useSelector(state => state.auth);

  // Get scenario options from activity content
  const scenarioOptions = activity?.content?.scenarios?.[0] || {
    complexity: 'medium',
    caseType: 'financial',
    timeSpan: 14
  };

  // Handle simulation completion
  const handleSimulationComplete = async (result) => {
    console.log('Simulation completed with result:', result);
    setSimulationComplete(true);
    setSimulationResult(result);

    // Update activity progress if simulation was successful and user is logged in
    if (result.success && user && activity) {
      const moduleId = 'module-4-escalation-fir';
      const activityId = activity.id;

      // Update activity progress
      dispatch(updateProgress({
        userId: user.id,
        moduleId,
        activityId,
        status: 'completed',
        score: result.totalScore,
        timeSpent: result.timeUsed
      }));

      // Notify parent component of completion
      if (onComplete) {
        onComplete(activityId, result);
      }
    }
  };

  // Handle starting the simulation
  const handleStartSimulation = () => {
    setShowIntro(false);
  };

  // Handle trying again
  const handleTryAgain = () => {
    setShowIntro(true);
    setSimulationComplete(false);
    setSimulationResult(null);
  };

  return (
    <div className="space-y-6">
      {showIntro ? (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaint Delay Scenario</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              In this simulation, you will practice handling cases where complaints have been delayed in processing.
              You&apos;ll need to analyze the timeline of events, understand the context, and make appropriate decisions
              about when to escalate a complaint to an FIR and file it in the CCTNS system.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Objectives:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Review the case timeline and understand the sequence of events</li>
              <li>Identify critical points where action should have been taken</li>
              <li>Make appropriate decisions about escalation to FIR</li>
              <li>Understand when and why cases should be filed in CCTNS</li>
              <li>Balance procedural requirements with victim needs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Decision Making:</h3>
            <p className="mb-6">
              You&apos;ll be presented with decision points where you must choose between:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Wait for more information:</strong> Appropriate when critical details are missing</li>
              <li><strong>Escalate to FIR:</strong> Required when cases meet specific criteria or time thresholds</li>
              <li><strong>File in CCTNS:</strong> Necessary for formal police investigation and legal proceedings</li>
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
        </Card>
      ) : simulationComplete ? (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Simulation {simulationResult?.success ? 'Complete' : 'Failed'}
          </h2>

          <div className={`border rounded-lg p-6 mb-6 ${simulationResult?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
            <h3 className={`text-xl font-semibold mb-3 ${simulationResult?.success ? 'text-green-800' : 'text-red-800'
              }`}>Your Performance</h3>

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
                  Don&apos;t worry! Understanding when to escalate cases takes practice.
                  Try again to improve your decision-making skills.
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleTryAgain}
              variant="primary"
              size="lg"
            >
              Try Again
            </Button>
          </div>
        </Card>
      ) : (
        <ComplaintDelayScenarioSimulation
          onComplete={handleSimulationComplete}
          options={scenarioOptions}
        />
      )}
    </div>
  );
};

ComplaintDelayScenarioModule.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    content: PropTypes.shape({
      type: PropTypes.string.isRequired,
      scenarios: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          complexity: PropTypes.string,
          caseType: PropTypes.string,
          timeSpan: PropTypes.number
        })
      )
    })
  }).isRequired,
  onComplete: PropTypes.func
};

export default ComplaintDelayScenarioModule;