/**
 * DecisionTreeDemo Component
 * 
 * This component demonstrates the decision-based scenario system
 * using the sample Module 4 decision tree.
 */
import React, { useState } from 'react';
import DecisionTreeContainer from './DecisionTreeContainer';
import { module4DecisionTree } from './SampleDecisionTree';

const DecisionTreeDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  const handleStart = () => {
    setIsActive(true);
    setCompletionData(null);
  };

  const handleComplete = (data) => {
    console.log('Decision tree completed:', data);
    setCompletionData(data);
    setIsActive(false);
  };

  const handleError = (error) => {
    console.error('Decision tree error:', error);
    alert(`Error: ${error.message}`);
  };

  const handleReset = () => {
    setIsActive(false);
    setCompletionData(null);
  };

  if (!isActive && !completionData) {
    return (
      <div className="decision-tree-demo max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Decision-Based Scenario Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Experience Module 4: Escalation to FIR and CCTNS
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              What you'll learn:
            </h2>
            <ul className="space-y-2 text-blue-700">
              <li>• When to escalate complaints to FIR filing</li>
              <li>• How to navigate the CCTNS interface</li>
              <li>• Appropriate legal sections for cybercrimes</li>
              <li>• Setting investigation priorities</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Estimated time:</strong> 10-15 minutes<br/>
              <strong>Difficulty:</strong> Intermediate
            </p>
          </div>

          <button
            onClick={handleStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Decision Scenario
          </button>
        </div>
      </div>
    );
  }

  if (completionData) {
    return (
      <div className="decision-tree-demo max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Scenario Complete! 🎉
            </h1>
            <p className="text-gray-600">
              You have completed the Module 4 decision scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Performance Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Score:</span>
                  <span className="font-bold">{completionData.totalScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Decisions Made:</span>
                  <span className="font-bold">{completionData.totalDecisions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Optimal Rate:</span>
                  <span className="font-bold">
                    {Math.round(completionData.optimalDecisionRate * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Spent:</span>
                  <span className="font-bold">
                    {Math.round(completionData.timeSpent / 1000)}s
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">Key Learnings</h3>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• Immediate FIR filing for amounts above ₹20,000</li>
                <li>• Use IPC 420 + IT Act 66C for fraud cases</li>
                <li>• High priority for senior citizen victims</li>
                <li>• 72-hour window critical for fund recovery</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="decision-tree-demo max-w-4xl mx-auto p-6">
      <DecisionTreeContainer
        treeData={module4DecisionTree}
        userId="demo-user"
        onComplete={handleComplete}
        onError={handleError}
        showProgress={true}
        autoAdvanceFeedback={false}
      />
    </div>
  );
};

export default DecisionTreeDemo;