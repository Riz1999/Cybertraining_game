import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import MatchPairsActivity from '../components/activities/MatchPairsActivity';
import { Card, Button } from '../components/ui';

const MatchPairsTestPage = () => {
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Test data for the MatchPairsActivity
  const testPairs = [
    {
      id: 'pair1',
      left: 'Nature of Crime',
      right: 'Financial Fraud (UPI-based)'
    },
    {
      id: 'pair2',
      left: 'Date of Occurrence',
      right: '15-06-2023'
    },
    {
      id: 'pair3',
      left: 'Place of Occurrence',
      right: 'Victim\'s location in Pune'
    },
    {
      id: 'pair4',
      left: 'Applicable IT Act Section',
      right: 'Section 66D - Cheating by personation'
    },
    {
      id: 'pair5',
      left: 'Applicable IPC Section',
      right: 'Section 420 - Cheating and dishonestly inducing delivery of property'
    },
    {
      id: 'pair6',
      left: 'Mode of Operation',
      right: 'Phishing through SMS with fraudulent website'
    },
    {
      id: 'pair7',
      left: 'Loss Amount',
      right: 'Rs. 2,50,000'
    },
    {
      id: 'pair8',
      left: 'Evidence Collected',
      right: 'SMS screenshot, website screenshot, transaction alerts, bank statement'
    }
  ];
  
  const handleActivityComplete = (activityScore) => {
    setScore(activityScore);
    setTestCompleted(true);
  };
  
  const resetTest = () => {
    setTestCompleted(false);
    setScore(0);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Match Pairs Activity Test</h1>
        
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${testCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <p>{testCompleted ? 'Test Completed' : 'Test In Progress'}</p>
              {testCompleted && <p className="font-medium">Score: {score}/10</p>}
            </div>
            
            {testCompleted && (
              <div className="mt-4">
                <Button variant="primary" onClick={resetTest}>
                  Reset Test
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">FIR Documentation Test</h2>
            <MatchPairsActivity
              instructions="Match each FIR field with the correct information from the case."
              pairs={testPairs}
              onComplete={handleActivityComplete}
              disabled={testCompleted}
            />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MatchPairsTestPage;