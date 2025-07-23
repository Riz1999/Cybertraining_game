import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionTracingContent from '../../data/transactionTracingContent';
import ModulePrerequisites from './ModulePrerequisites';
import ModuleCompletion from './ModuleCompletion';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';

// UI Components
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import ProgressBar from '../ui/ProgressBar';
import Accordion from '../ui/Accordion';

// Activity Components
import TransactionMapComponent from '../activities/TransactionMapComponent';
import WhoisIPTracingSimulation from '../activities/WhoisIPTracingSimulation';
import MuleAccountIdentificationInterface from '../activities/MuleAccountIdentificationInterface';
import LegalStepsQuiz from '../activities/LegalStepsQuiz';

const TransactionTracingModule = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateProgress, getUserProgress } = useProgress();

  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab changes
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  const [userProgress, setUserProgress] = useState({
    transactionMapCompleted: false,
    whoisIPTracingCompleted: false,
    muleAccountIdentificationCompleted: false,
    legalStepsQuizCompleted: false,
    overallScore: 0,
    maxScore: 100
  });
  
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [showPrerequisites, setShowPrerequisites] = useState(true);

  // Check if user has completed prerequisites
  useEffect(() => {
    const checkPrerequisites = async () => {
      // Skip prerequisites check if no user is logged in
      if (!currentUser || !currentUser.uid) {
        setShowPrerequisites(false); // Allow access for testing
        return;
      }

      const progress = await getUserProgress(currentUser.uid);
      if (progress && progress.completedModules &&
        progress.completedModules.includes('module-5-financial-fraud-investigation-level-2')) {
        setShowPrerequisites(false);
      }
    };

    checkPrerequisites();
  }, [currentUser, getUserProgress]);

  // Handle task completion
  const handleTaskCompletion = (taskId, score, maxScore) => {
    const updatedProgress = { ...userProgress };

    switch (taskId) {
      case 'transaction-map':
        updatedProgress.transactionMapCompleted = true;
        break;
      case 'whois-ip-tracing':
        updatedProgress.whoisIPTracingCompleted = true;
        break;
      case 'mule-account-identification':
        updatedProgress.muleAccountIdentificationCompleted = true;
        break;
      case 'legal-steps-quiz':
        updatedProgress.legalStepsQuizCompleted = true;
        break;
      default:
        break;
    }

    // Update overall score
    updatedProgress.overallScore += score;

    // Check if all tasks are completed
    const allTasksCompleted =
      updatedProgress.transactionMapCompleted &&
      updatedProgress.whoisIPTracingCompleted &&
      updatedProgress.muleAccountIdentificationCompleted &&
      updatedProgress.legalStepsQuizCompleted;

    if (allTasksCompleted) {
      setModuleCompleted(true);
      // Save progress to backend (only if user is logged in)
      if (currentUser && currentUser.uid) {
        updateProgress(currentUser.uid, {
          moduleId: 'module-5-financial-fraud-investigation',
          activityId: 'transaction-tracing',
          completed: true,
          score: updatedProgress.overallScore
        });
      }
    }

    setUserProgress(updatedProgress);
  };

  // Handle module completion
  const handleModuleCompletion = () => {
    navigate('/modules/module-5-financial-fraud-investigation/legal-case-building');
  };

  // If prerequisites not met, show prerequisites component
  if (showPrerequisites) {
    return (
      <ModulePrerequisites
        moduleId="module-5-financial-fraud-investigation-level-3"
        prerequisites={[
          {
            moduleId: 'module-5-financial-fraud-investigation-level-2',
            title: 'Evidence Collection',
            reason: 'Understanding evidence collection procedures is essential before proceeding to transaction tracing.'
          }
        ]}
      />
    );
  }

  // If module is completed, show completion component
  if (moduleCompleted) {
    return (
      <ModuleCompletion
        title="Level 3 Completed: Transaction Tracing"
        score={userProgress.overallScore}
        maxScore={userProgress.maxScore}
        message="You have successfully completed the third level of the Financial Fraud Investigation module. You've demonstrated your ability to trace complex transaction trails, identify mule accounts, and understand the legal steps for account freezing."
        nextModule={{
          title: "Level 4: Legal Case Building",
          description: "Learn how to build a strong legal case with appropriate IPC and IT Act sections."
        }}
        onContinue={handleModuleCompletion}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Module 5: Financial Fraud Investigation
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Level 3
                </span>
                <span className="text-gray-600">{transactionTracingContent.title}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Your Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userProgress.overallScore}/{userProgress.maxScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Your Progress
              </h3>
              <div className="text-right">
                <span className="text-sm text-gray-500">Overall Score</span>
                <div className="text-lg font-bold text-gray-900">
                  {Math.round((userProgress.overallScore / userProgress.maxScore) * 100)}%
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <ProgressBar
                percentage={(userProgress.overallScore / userProgress.maxScore) * 100}
                label={`${Math.round((userProgress.overallScore / userProgress.maxScore) * 100)}% Complete`}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.transactionMapCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.transactionMapCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.transactionMapCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">1</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.transactionMapCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Transaction Map
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.whoisIPTracingCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.whoisIPTracingCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.whoisIPTracingCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">2</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.whoisIPTracingCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  WHOIS & IP Tracing
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.muleAccountIdentificationCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.muleAccountIdentificationCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.muleAccountIdentificationCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">3</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.muleAccountIdentificationCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Mule Account ID
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.legalStepsQuizCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.legalStepsQuizCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.legalStepsQuizCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">4</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.legalStepsQuizCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Legal Steps Quiz
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs
          tabs={[
            {
              label: "Scenario",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.scenario.title}</h3>
                    <p className="text-gray-700 mb-6">{transactionTracingContent.scenario.description}</p>

                    <div className="mb-6">
                      {transactionTracingContent.scenario.details}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(1)}
                      >
                        Begin Transaction Tracing
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Transaction Map",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.tasks[0].title}</h3>
                    <p className="text-gray-700 mb-6">{transactionTracingContent.tasks[0].description}</p>

                    <TransactionMapComponent
                      transactionData={transactionTracingContent.tasks[0].transactionData}
                      instructions={transactionTracingContent.tasks[0].instructions}
                      onComplete={(score) => handleTaskCompletion('transaction-map', score, 25)}
                      disabled={userProgress.transactionMapCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(2)}
                        disabled={!userProgress.transactionMapCompleted}
                      >
                        Continue to WHOIS & IP Tracing
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "WHOIS & IP Tracing",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.tasks[1].title}</h3>
                    <p className="text-gray-700 mb-6">{transactionTracingContent.tasks[1].description}</p>

                    <WhoisIPTracingSimulation
                      domainData={transactionTracingContent.tasks[1].domainData}
                      ipData={transactionTracingContent.tasks[1].ipData}
                      instructions={transactionTracingContent.tasks[1].instructions}
                      onComplete={(score) => handleTaskCompletion('whois-ip-tracing', score, 25)}
                      disabled={!userProgress.transactionMapCompleted || userProgress.whoisIPTracingCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(3)}
                        disabled={!userProgress.whoisIPTracingCompleted}
                      >
                        Continue to Mule Account Identification
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Mule Account Identification",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.tasks[2].title}</h3>
                    <p className="text-gray-700 mb-6">{transactionTracingContent.tasks[2].description}</p>

                    <MuleAccountIdentificationInterface
                      accountData={transactionTracingContent.tasks[2].accountData}
                      instructions={transactionTracingContent.tasks[2].instructions}
                      onComplete={(score) => handleTaskCompletion('mule-account-identification', score, 25)}
                      disabled={!userProgress.whoisIPTracingCompleted || userProgress.muleAccountIdentificationCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(4)}
                        disabled={!userProgress.muleAccountIdentificationCompleted}
                      >
                        Continue to Legal Steps Quiz
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Legal Steps Quiz",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.tasks[3].title}</h3>
                    <p className="text-gray-700 mb-6">{transactionTracingContent.tasks[3].description}</p>

                    <LegalStepsQuiz
                      questions={transactionTracingContent.tasks[3].questions}
                      instructions={transactionTracingContent.tasks[3].instructions}
                      onComplete={(score) => handleTaskCompletion('legal-steps-quiz', score, 25)}
                      disabled={!userProgress.muleAccountIdentificationCompleted || userProgress.legalStepsQuizCompleted}
                    />

                    {userProgress.legalStepsQuizCompleted && (
                      <div className="mt-6">
                        <Alert type="success" title="All tasks completed!">
                          You have successfully completed all the tasks in this level. Review the summary to continue.
                        </Alert>

                        <div className="mt-4">
                          <Button
                            variant="primary"
                            onClick={() => setActiveTab(5)}
                          >
                            View Summary
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            },
            {
              label: "Summary",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{transactionTracingContent.summary.title}</h3>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Key Learnings</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {transactionTracingContent.summary.points.map((point, index) => (
                          <li key={index} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Next Steps</h4>
                      <p className="text-gray-700">{transactionTracingContent.summary.nextSteps}</p>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setModuleCompleted(true)}
                      >
                        Complete Level 3
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            }
          ]}
          defaultTab={activeTab}
          variant="underline"
          className="mb-6"
          onChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default TransactionTracingModule;