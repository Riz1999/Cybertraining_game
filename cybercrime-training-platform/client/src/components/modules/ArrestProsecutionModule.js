import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProgress } from '../../store/actions/progressActions';

// Import components
import InterstateCoordinationWorkflow from '../activities/InterstateCoordinationWorkflow';
import SuspectInterrogationDialog from '../activities/SuspectInterrogationDialog';
import PostArrestReportingInterface from '../activities/PostArrestReportingInterface';
import MatchPairsActivity from '../activities/MatchPairsActivity';

// Import content data
import {
  interstateCoordinationData,
  suspectInterrogationData,
  postArrestReportingData,
  legalProcedureMatchingData
} from '../../data/arrestProsecutionContent';

/**
 * Arrest and Prosecution Module Component
 * 
 * This component manages the Level 5 activities for the Financial Fraud Investigation module,
 * including interstate coordination, suspect interrogation, post-arrest reporting, and legal procedures.
 */
const ArrestProsecutionModule = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({
    coordination: 0,
    interrogation: 0,
    reporting: 0,
    legalProcedures: 0
  });
  const [completed, setCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calculate total score when individual scores change
  useEffect(() => {
    const calculatedTotal = (
      scores.coordination +
      scores.interrogation +
      scores.reporting +
      scores.legalProcedures
    ) / 4; // Average of all activities
    
    setTotalScore(Math.round(calculatedTotal));
  }, [scores]);

  // Handle completion of the interstate coordination activity
  const handleCoordinationComplete = (score) => {
    setScores(prevScores => ({
      ...prevScores,
      coordination: score
    }));
    
    // Automatically advance to next step after a delay
    setTimeout(() => {
      setCurrentStep(1);
    }, 2000);
  };

  // Handle completion of the suspect interrogation activity
  const handleInterrogationComplete = (score) => {
    setScores(prevScores => ({
      ...prevScores,
      interrogation: score
    }));
    
    // Automatically advance to next step after a delay
    setTimeout(() => {
      setCurrentStep(2);
    }, 2000);
  };

  // Handle completion of the post-arrest reporting activity
  const handleReportingComplete = (score) => {
    setScores(prevScores => ({
      ...prevScores,
      reporting: score
    }));
    
    // Automatically advance to next step after a delay
    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);
  };

  // Handle completion of the legal procedure matching activity
  const handleLegalProceduresComplete = (score) => {
    setScores(prevScores => ({
      ...prevScores,
      legalProcedures: score * 10 // Convert from 0-10 to 0-100 scale
    }));
    
    // Mark the entire module as completed
    setCompleted(true);
    
    // Update module progress in Redux store
    dispatch(updateProgress({
      moduleId: 'module-5-financial-fraud-investigation',
      activityId: 'arrest-prosecution',
      score: totalScore,
      completed: true
    }));
  };

  // Handle completion of the entire module
  const handleModuleComplete = () => {
    // Navigate back to the module detail page
    navigate('/modules/module-5-financial-fraud-investigation');
  };

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <InterstateCoordinationWorkflow
            workflowData={interstateCoordinationData}
            onComplete={handleCoordinationComplete}
          />
        );
      
      case 1:
        return (
          <SuspectInterrogationDialog
            interrogationData={suspectInterrogationData}
            onComplete={handleInterrogationComplete}
          />
        );
      
      case 2:
        return (
          <PostArrestReportingInterface
            reportingData={postArrestReportingData}
            onComplete={handleReportingComplete}
          />
        );
      
      case 3:
        return (
          <MatchPairsActivity
            instructions={legalProcedureMatchingData.instructions}
            pairs={legalProcedureMatchingData.pairs}
            onComplete={handleLegalProceduresComplete}
          />
        );
      
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Module 5: Financial Fraud Investigation</h1>
      <h2 className="text-2xl font-semibold mb-6">Level 5: Arrest and Prosecution</h2>

      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Activity {currentStep + 1} of 4
          </span>
          {totalScore > 0 && (
            <span className="text-sm font-medium text-gray-700">
              Current Score: {totalScore}/100
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Activity steps */}
      <div className="flex mb-6 border-b border-gray-200">
        <div 
          className={`pb-2 px-4 ${currentStep === 0 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Interstate Coordination
        </div>
        <div 
          className={`pb-2 px-4 ${currentStep === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Suspect Interrogation
        </div>
        <div 
          className={`pb-2 px-4 ${currentStep === 2 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Post-Arrest Reporting
        </div>
        <div 
          className={`pb-2 px-4 ${currentStep === 3 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Legal Procedures
        </div>
      </div>

      {/* Current activity */}
      {renderCurrentStep()}

      {/* Completion message */}
      {completed && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-3">
            Level 5 Completed!
          </h3>
          <p className="text-green-700 mb-4">
            You have successfully completed the Arrest and Prosecution level of the Financial Fraud Investigation module.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Activity Scores</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Interstate Coordination:</span>
                  <span className="font-medium">{scores.coordination}/100</span>
                </li>
                <li className="flex justify-between">
                  <span>Suspect Interrogation:</span>
                  <span className="font-medium">{scores.interrogation}/100</span>
                </li>
                <li className="flex justify-between">
                  <span>Post-Arrest Reporting:</span>
                  <span className="font-medium">{scores.reporting}/100</span>
                </li>
                <li className="flex justify-between">
                  <span>Legal Procedures:</span>
                  <span className="font-medium">{scores.legalProcedures}/100</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Overall Performance</h4>
              <div className="flex items-center justify-between mb-2">
                <span>Total Score:</span>
                <span className="text-xl font-bold">{totalScore}/100</span>
              </div>
              
              {totalScore >= 80 && (
                <p className="text-green-600">
                  Excellent work! You&apos;ve demonstrated strong understanding of arrest and prosecution procedures.
                </p>
              )}
              
              {totalScore >= 60 && totalScore < 80 && (
                <p className="text-amber-600">
                  Good job! You&apos;ve shown competence in arrest and prosecution procedures, but there&apos;s room for improvement.
                </p>
              )}
              
              {totalScore < 60 && (
                <p className="text-red-600">
                  You need more practice with arrest and prosecution procedures. Consider reviewing the material and trying again.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleModuleComplete}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Module Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrestProsecutionModule;