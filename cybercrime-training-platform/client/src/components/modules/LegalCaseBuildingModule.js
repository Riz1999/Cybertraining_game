import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import legalCaseBuildingContent from '../../data/legalCaseBuildingContent';
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

// Activity Components
import LegalSectionAssignment from '../activities/LegalSectionAssignment';
import EvidenceChronologicalOrganizer from '../activities/EvidenceChronologicalOrganizer';
import CaseReportDrafter from '../activities/CaseReportDrafter';
import EvidenceAdmissibilityQuiz from '../activities/EvidenceAdmissibilityQuiz';

const LegalCaseBuildingModule = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateProgress, getUserProgress } = useProgress();

  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab changes
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  const [userProgress, setUserProgress] = useState({
    legalSectionAssignmentCompleted: false,
    evidenceChronologicalOrganizerCompleted: false,
    caseReportDrafterCompleted: false,
    evidenceAdmissibilityQuizCompleted: false,
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
        progress.completedModules.includes('module-5-financial-fraud-investigation-level-3')) {
        setShowPrerequisites(false);
      }
    };

    checkPrerequisites();
  }, [currentUser, getUserProgress]);

  // Handle task completion
  const handleTaskCompletion = (taskId, score, maxScore) => {
    const updatedProgress = { ...userProgress };

    switch (taskId) {
      case 'legal-section-assignment':
        updatedProgress.legalSectionAssignmentCompleted = true;
        break;
      case 'evidence-chronological-organizer':
        updatedProgress.evidenceChronologicalOrganizerCompleted = true;
        break;
      case 'case-report-drafter':
        updatedProgress.caseReportDrafterCompleted = true;
        break;
      case 'evidence-admissibility-quiz':
        updatedProgress.evidenceAdmissibilityQuizCompleted = true;
        break;
      default:
        break;
    }

    // Update overall score
    updatedProgress.overallScore += score;

    // Check if all tasks are completed
    const allTasksCompleted =
      updatedProgress.legalSectionAssignmentCompleted &&
      updatedProgress.evidenceChronologicalOrganizerCompleted &&
      updatedProgress.caseReportDrafterCompleted &&
      updatedProgress.evidenceAdmissibilityQuizCompleted;

    if (allTasksCompleted) {
      setModuleCompleted(true);
      // Save progress to backend (only if user is logged in)
      if (currentUser && currentUser.uid) {
        updateProgress(currentUser.uid, {
          moduleId: 'module-5-financial-fraud-investigation',
          activityId: 'legal-case-building',
          completed: true,
          score: updatedProgress.overallScore
        });
      }
    }

    setUserProgress(updatedProgress);
  };

  // Handle module completion
  const handleModuleCompletion = () => {
    navigate('/modules/module-5-financial-fraud-investigation/arrest-prosecution');
  };

  // If prerequisites not met, show prerequisites component
  if (showPrerequisites) {
    return (
      <ModulePrerequisites
        moduleId="module-5-financial-fraud-investigation-level-4"
        prerequisites={[
          {
            moduleId: 'module-5-financial-fraud-investigation-level-3',
            title: 'Transaction Tracing',
            reason: 'Understanding transaction tracing is essential before proceeding to legal case building.'
          }
        ]}
      />
    );
  }

  // If module is completed, show completion component
  if (moduleCompleted) {
    return (
      <ModuleCompletion
        title="Level 4 Completed: Legal Case Building"
        score={userProgress.overallScore}
        maxScore={userProgress.maxScore}
        message="You have successfully completed the fourth level of the Financial Fraud Investigation module. You've demonstrated your ability to build a strong legal case with appropriate IPC and IT Act sections, organize evidence chronologically, draft comprehensive case reports, and assess evidence admissibility."
        nextModule={{
          title: "Level 5: Arrest and Prosecution",
          description: "Learn about interstate coordination, suspect interrogation, and post-arrest procedures."
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
                  Level 4
                </span>
                <span className="text-gray-600">{legalCaseBuildingContent.title}</span>
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
                userProgress.legalSectionAssignmentCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.legalSectionAssignmentCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.legalSectionAssignmentCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">1</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.legalSectionAssignmentCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Legal Sections
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.evidenceChronologicalOrganizerCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.evidenceChronologicalOrganizerCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.evidenceChronologicalOrganizerCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">2</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.evidenceChronologicalOrganizerCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Evidence Timeline
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.caseReportDrafterCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.caseReportDrafterCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.caseReportDrafterCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">3</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.caseReportDrafterCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Case Report
                </p>
              </div>
              
              <div className={`p-4 rounded-xl text-center transition-all duration-200 ${
                userProgress.evidenceAdmissibilityQuizCompleted 
                  ? 'bg-green-50 border-2 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  userProgress.evidenceAdmissibilityQuizCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {userProgress.evidenceAdmissibilityQuizCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white text-sm font-bold">4</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${
                  userProgress.evidenceAdmissibilityQuizCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  Admissibility
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
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.scenario.title}</h3>
                    <p className="text-gray-700 mb-6">{legalCaseBuildingContent.scenario.description}</p>

                    <div className="mb-6">
                      {legalCaseBuildingContent.scenario.details}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(1)}
                      >
                        Begin Legal Case Building
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Legal Sections",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.tasks[0].title}</h3>
                    <p className="text-gray-700 mb-6">{legalCaseBuildingContent.tasks[0].description}</p>

                    <LegalSectionAssignment
                      legalSections={legalCaseBuildingContent.tasks[0].legalSections}
                      instructions={legalCaseBuildingContent.tasks[0].instructions}
                      onComplete={(score) => handleTaskCompletion('legal-section-assignment', score, 25)}
                      disabled={userProgress.legalSectionAssignmentCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(2)}
                        disabled={!userProgress.legalSectionAssignmentCompleted}
                      >
                        Continue to Evidence Timeline
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Evidence Timeline",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.tasks[1].title}</h3>
                    <p className="text-gray-700 mb-6">{legalCaseBuildingContent.tasks[1].description}</p>

                    <EvidenceChronologicalOrganizer
                      evidenceItems={legalCaseBuildingContent.tasks[1].evidenceItems}
                      instructions={legalCaseBuildingContent.tasks[1].instructions}
                      onComplete={(score) => handleTaskCompletion('evidence-chronological-organizer', score, 25)}
                      disabled={!userProgress.legalSectionAssignmentCompleted || userProgress.evidenceChronologicalOrganizerCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(3)}
                        disabled={!userProgress.evidenceChronologicalOrganizerCompleted}
                      >
                        Continue to Case Report
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Case Report",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.tasks[2].title}</h3>
                    <p className="text-gray-700 mb-6">{legalCaseBuildingContent.tasks[2].description}</p>

                    <CaseReportDrafter
                      reportTemplate={legalCaseBuildingContent.tasks[2].reportTemplate}
                      instructions={legalCaseBuildingContent.tasks[2].instructions}
                      onComplete={(score) => handleTaskCompletion('case-report-drafter', score, 25)}
                      disabled={!userProgress.evidenceChronologicalOrganizerCompleted || userProgress.caseReportDrafterCompleted}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab(4)}
                        disabled={!userProgress.caseReportDrafterCompleted}
                      >
                        Continue to Evidence Admissibility
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              label: "Evidence Admissibility",
              content: (
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.tasks[3].title}</h3>
                    <p className="text-gray-700 mb-6">{legalCaseBuildingContent.tasks[3].description}</p>

                    <EvidenceAdmissibilityQuiz
                      evidenceItems={legalCaseBuildingContent.tasks[3].evidenceItems}
                      instructions={legalCaseBuildingContent.tasks[3].instructions}
                      onComplete={(score) => handleTaskCompletion('evidence-admissibility-quiz', score, 25)}
                      disabled={!userProgress.caseReportDrafterCompleted || userProgress.evidenceAdmissibilityQuizCompleted}
                    />

                    {userProgress.evidenceAdmissibilityQuizCompleted && (
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
                    <h3 className="text-xl font-semibold mb-4">{legalCaseBuildingContent.summary.title}</h3>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Key Learnings</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {legalCaseBuildingContent.summary.points.map((point, index) => (
                          <li key={index} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Next Steps</h4>
                      <p className="text-gray-700">{legalCaseBuildingContent.summary.nextSteps}</p>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => setModuleCompleted(true)}
                      >
                        Complete Level 4
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

export default LegalCaseBuildingModule;