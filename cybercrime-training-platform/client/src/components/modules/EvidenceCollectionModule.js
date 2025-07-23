import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import evidenceCollectionContent from '../../data/evidenceCollectionContent';
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
import ToolSelectionActivity from '../activities/ToolSelectionActivity';
import FillInBlanksActivity from '../activities/FillInBlanksActivity';
import SequenceActivity from '../activities/SequenceActivity';
import FormCompletionActivity from '../activities/FormCompletionActivity';
import ColorFeedbackQuiz from '../activities/ColorFeedbackQuiz';

const EvidenceCollectionModule = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateProgress, getUserProgress } = useProgress();

  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab changes
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  const [userProgress, setUserProgress] = useState({
    evidenceSecuringCompleted: false,
    noticeDraftingCompleted: false,
    evidenceChainCompleted: false,
    section65bCompleted: false,
    quizCompleted: false,
    overallScore: 0,
    maxScore: 50
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
        progress.completedModules.includes('module-5-financial-fraud-investigation-level-1')) {
        setShowPrerequisites(false);
      }
    };

    checkPrerequisites();
  }, [currentUser, getUserProgress]);

  // Handle task completion
  const handleTaskCompletion = (taskId, score, maxScore) => {
    const updatedProgress = { ...userProgress };

    switch (taskId) {
      case 'evidence-securing':
        updatedProgress.evidenceSecuringCompleted = true;
        break;
      case 'notice-drafting':
        updatedProgress.noticeDraftingCompleted = true;
        break;
      case 'evidence-chain':
        updatedProgress.evidenceChainCompleted = true;
        break;
      case 'section-65b':
        updatedProgress.section65bCompleted = true;
        break;
      case 'quiz':
        updatedProgress.quizCompleted = true;
        break;
      default:
        break;
    }

    // Update overall score
    updatedProgress.overallScore += score;

    // Check if all tasks are completed
    const allTasksCompleted =
      updatedProgress.evidenceSecuringCompleted &&
      updatedProgress.noticeDraftingCompleted &&
      updatedProgress.evidenceChainCompleted &&
      updatedProgress.section65bCompleted &&
      updatedProgress.quizCompleted;

    if (allTasksCompleted) {
      setModuleCompleted(true);
      // Save progress to backend (only if user is logged in)
      if (currentUser && currentUser.uid) {
        updateProgress(currentUser.uid, {
          moduleId: 'module-5-financial-fraud-investigation',
          activityId: 'evidence-collection',
          completed: true,
          score: updatedProgress.overallScore
        });
      }
    }

    setUserProgress(updatedProgress);
  };

  // Handle module completion
  const handleModuleCompletion = () => {
    navigate('/modules/module-5-financial-fraud-investigation/transaction-tracing');
  };

  // If prerequisites not met, show prerequisites component
  if (showPrerequisites) {
    return (
      <ModulePrerequisites
        moduleId="module-5-financial-fraud-investigation-level-2"
        prerequisites={[
          {
            moduleId: 'module-5-financial-fraud-investigation-level-1',
            title: 'Complaint Analysis',
            reason: 'Understanding complaint analysis is essential before proceeding to evidence collection.'
          }
        ]}
      />
    );
  }

  // If module is completed, show completion component
  if (moduleCompleted) {
    return (
      <ModuleCompletion
        title="Level 2 Completed: Evidence Collection"
        score={userProgress.overallScore}
        maxScore={userProgress.maxScore}
        message="You have successfully completed the second level of the Financial Fraud Investigation module. You've demonstrated your ability to properly secure digital evidence, maintain chain of custody, and prepare legal documentation."
        nextModule={{
          title: "Level 3: Transaction Tracing",
          description: "Learn how to trace complex transaction trails across multiple accounts and payment systems."
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
                  Level 2
                </span>
                <span className="text-gray-600">{evidenceCollectionContent.title}</span>
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
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.evidenceSecuringCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.evidenceSecuringCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.evidenceSecuringCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">1</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.evidenceSecuringCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Evidence Securing
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.noticeDraftingCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.noticeDraftingCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.noticeDraftingCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">2</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.noticeDraftingCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Legal Notices
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.evidenceChainCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.evidenceChainCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.evidenceChainCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">3</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.evidenceChainCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Chain of Custody
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.section65bCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.section65bCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.section65bCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">4</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.section65bCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Section 65B
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.quizCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.quizCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.quizCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">5</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.quizCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Quiz
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
                    <h3 className="text-xl font-semibold mb-4">{evidenceCollectionContent.scenario.title}</h3>
                    <p className="text-gray-700 mb-6">{evidenceCollectionContent.scenario.description}</p>

                    <div className="mb-6">
                      {evidenceCollectionContent.scenario.details}
                    </div>

                    <Accordion title="Evidence Items" defaultOpen={true}>
                      <div className="space-y-6">
                        {evidenceCollectionContent.scenario.evidenceItems.map(item => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                            <p className="text-gray-600 mb-4">{item.description}</p>

                            <div className="bg-gray-50 p-3 rounded">
                              <h5 className="font-medium mb-2">Recommended Security Measures</h5>
                              <ul className="list-disc pl-5">
                                {item.securityMeasures.map((measure, index) => (
                                  <li key={index} className="text-gray-700 mb-1">{measure}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(1)}
                      >
                        Begin Evidence Collection Tasks
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Evidence Collection Tasks",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Evidence Collection Tasks</h3>

                    <Accordion
                      title={evidenceCollectionContent.tasks[0].title}
                      defaultOpen={!userProgress.evidenceSecuringCompleted}
                      disabled={userProgress.evidenceSecuringCompleted}
                    >
                      <div className="mb-6">
                        <p className="mb-4">{evidenceCollectionContent.tasks[0].description}</p>
                        <ToolSelectionActivity
                          evidenceItems={evidenceCollectionContent.tasks[0].evidenceItems}
                          onComplete={(score) => handleTaskCompletion('evidence-securing', score, 10)}
                          disabled={userProgress.evidenceSecuringCompleted}
                        />
                      </div>
                    </Accordion>

                    <Accordion
                      title={evidenceCollectionContent.tasks[1].title}
                      defaultOpen={userProgress.evidenceSecuringCompleted && !userProgress.noticeDraftingCompleted}
                      disabled={!userProgress.evidenceSecuringCompleted || userProgress.noticeDraftingCompleted}
                    >
                      <div className="mb-6">
                        <p className="mb-4">{evidenceCollectionContent.tasks[1].description}</p>
                        <FillInBlanksActivity
                          templates={evidenceCollectionContent.tasks[1].templates}
                          instructions={evidenceCollectionContent.tasks[1].instructions}
                          onComplete={(score) => handleTaskCompletion('notice-drafting', score, 10)}
                          disabled={!userProgress.evidenceSecuringCompleted || userProgress.noticeDraftingCompleted}
                        />
                      </div>
                    </Accordion>

                    <Accordion
                      title={evidenceCollectionContent.tasks[2].title}
                      defaultOpen={userProgress.noticeDraftingCompleted && !userProgress.evidenceChainCompleted}
                      disabled={!userProgress.noticeDraftingCompleted || userProgress.evidenceChainCompleted}
                    >
                      <div className="mb-6">
                        <p className="mb-4">{evidenceCollectionContent.tasks[2].description}</p>
                        <SequenceActivity
                          steps={evidenceCollectionContent.tasks[2].steps}
                          instructions={evidenceCollectionContent.tasks[2].instructions}
                          onComplete={(score) => handleTaskCompletion('evidence-chain', score, 10)}
                          disabled={!userProgress.noticeDraftingCompleted || userProgress.evidenceChainCompleted}
                        />
                      </div>
                    </Accordion>

                    <Accordion
                      title={evidenceCollectionContent.tasks[3].title}
                      defaultOpen={userProgress.evidenceChainCompleted && !userProgress.section65bCompleted}
                      disabled={!userProgress.evidenceChainCompleted || userProgress.section65bCompleted}
                    >
                      <div className="mb-6">
                        <p className="mb-4">{evidenceCollectionContent.tasks[3].description}</p>
                        <FormCompletionActivity
                          formFields={evidenceCollectionContent.tasks[3].formFields}
                          instructions={evidenceCollectionContent.tasks[3].instructions}
                          onComplete={(score) => handleTaskCompletion('section-65b', score, 10)}
                          disabled={!userProgress.evidenceChainCompleted || userProgress.section65bCompleted}
                        />
                      </div>
                    </Accordion>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(2)}
                        disabled={!userProgress.section65bCompleted}
                      >
                        Continue to Knowledge Check
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Knowledge Check",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{evidenceCollectionContent.quiz.title}</h3>
                    <p className="text-gray-700 mb-6">{evidenceCollectionContent.quiz.description}</p>

                    <ColorFeedbackQuiz
                      questions={evidenceCollectionContent.quiz.questions}
                      onComplete={(score) => handleTaskCompletion('quiz', score, 10)}
                    />

                    {userProgress.quizCompleted && (
                      <div className="mt-6">
                        <Alert type="success" title="All tasks completed!">
                          You have successfully completed all the tasks in this level. Review the summary to continue.
                        </Alert>

                        <div className="mt-4">
                          <Button
                            variant="primary"
                            onClick={() => setActiveTab(3)}
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
                    <h3 className="text-xl font-semibold mb-4">{evidenceCollectionContent.summary.title}</h3>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Key Learnings</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {evidenceCollectionContent.summary.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Next Steps</h4>
                      <p>{evidenceCollectionContent.summary.nextSteps}</p>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setModuleCompleted(true)}
                      >
                        Complete Level 2
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

export default EvidenceCollectionModule;