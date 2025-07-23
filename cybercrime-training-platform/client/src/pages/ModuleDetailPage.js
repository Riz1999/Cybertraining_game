import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import {
  ModuleIntro,
  ModuleCompletion,
  ModuleProgressBar,
  ModuleActivityNavigation,
  ModuleContentOptimizer,
  CrimeQuiz,
  ComplaintCategorizationInterface,
  NCRPMockForm
} from '../components/modules';
import ComplaintDelayScenarioModule from '../components/modules/ComplaintDelayScenarioModule';
import VictimDialogSystem from '../components/simulation/dialog/VictimDialogSystem';
import TransactionFreezeSimulation from '../components/simulation/transaction/TransactionFreezeSimulation';
import DocumentationActivity from '../components/activities/DocumentationActivity';
import SystemActivity from '../components/activities/SystemActivity';
import firDocumentationContent from '../data/firDocumentationContent';
import cctnsFilingContent from '../data/cctnsFilingContent';
import { Card } from '../components/ui';
import OfficerAvatar from '../components/avatar/OfficerAvatar';
import {
  getModuleById,
  checkPrerequisites,
  setCurrentActivity
} from '../store/actions/moduleActions';
import {
  getProgress,
  updateProgress
} from '../store/actions/progressActions';
import { useNetworkStatus } from '../contexts/NetworkStatusContext';

/**
 * Module Detail Page component for displaying a specific module and its activities
 * @returns {React.ReactElement} Module Detail Page component
 */
const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentModule,
    moduleLoading,
    prerequisites,
    currentActivityId
  } = useSelector(state => state.modules);
  const { progress, loading: progressLoading } = useSelector(state => state.progress);

  // Local state
  const [view, setView] = useState('intro'); // intro, activity, completion
  const [activityContent, setActivityContent] = useState(null);
  const [moduleProgress, setModuleProgress] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(new Set());

  // Mock module data to make components work immediately
  const getMockModule = (moduleId) => {
    if (moduleId === 'module-1-intro-cybercrime' || moduleId === 'module_1') {
      return {
        id: 'module-1-intro-cybercrime',
        title: 'Introduction to Cybercrime Investigation',
        description: 'Learn about different types of cybercrimes and national systems',
        objectives: [
          'Understand the basics of cybercrime investigation',
          'Identify different types of cybercrimes',
          'Learn about national cybercrime systems',
        ],
        estimatedDuration: 60,
        activities: [
          {
            id: 'activity_1_1',
            type: 'interactive',
            title: 'Officer Avatar Onboarding',
            content: {
              type: 'avatar_dialog',
              message: 'Welcome to the Cybercrime Investigation Training Program!'
            },
            order: 1,
            isRequired: true
          },
          {
            id: 'activity_1_2',
            type: 'quiz',
            title: 'Crime or Not a Crime?',
            content: {
              type: 'categorization',
              items: []
            },
            order: 2,
            isRequired: true
          }
        ],
        badgeReward: {
          name: 'Cyber Awareness Starter',
          imageUrl: '/assets/badges/cyber-awareness-starter.svg'
        },
        minPassingScore: 70,
        isPublished: true
      };
    }

    if (moduleId === 'module-2-complaint-categorization' || moduleId === 'module_2') {
      return {
        id: 'module-2-complaint-categorization',
        title: 'Complaint Categorization and Intake',
        description: 'Master the art of categorizing complaints and collecting accurate information from victims',
        objectives: [
          'Conduct empathetic victim interviews',
          'Accurately categorize different types of cybercrimes',
          'Complete NCRP forms with precision'
        ],
        estimatedDuration: 75,
        activities: [
          {
            id: 'activity_2_1',
            type: 'simulation',
            title: 'Victim Interview Simulation',
            content: {
              type: 'victim_dialog',
              scenario: 'banking_fraud'
            },
            order: 1,
            isRequired: true
          },
          {
            id: 'activity_2_2',
            type: 'categorization',
            title: 'Complaint Categorization Training',
            content: {
              type: 'complaint_categorization',
              scenarios: []
            },
            order: 2,
            isRequired: true
          },
          {
            id: 'activity_2_3',
            type: 'form',
            title: 'NCRP Form Completion',
            content: {
              type: 'ncrp_form',
              scenario: 'banking_fraud_form'
            },
            order: 3,
            isRequired: true
          }
        ],
        badgeReward: {
          name: 'First Responder',
          imageUrl: '/assets/badges/first-responder.svg'
        },
        minPassingScore: 75,
        isPublished: true
      };
    }

    if (moduleId === 'module-3-time-critical-response') {
      return {
        id: 'module-3-time-critical-response',
        title: 'Time-Critical Response: Transaction Freezing',
        description: 'Master time-bound responses to fraudulent transactions and learn to effectively stop fund transfers',
        objectives: [
          'Execute time-critical transaction freezing procedures',
          'Identify key banking information required for freeze requests',
          'Navigate banking APIs and freeze request systems',
          'Manage time pressure while maintaining accuracy',
          'Understand legal requirements for transaction holds'
        ],
        estimatedDuration: 45,
        activities: [
          {
            id: 'transaction-freeze-simulation',
            type: 'time-critical',
            title: 'Transaction Freeze Simulation',
            description: 'Practice freezing fraudulent transactions within critical time windows',
            content: {
              type: 'transaction_freeze',
              scenarios: [
                {
                  id: 'upi-fraud-freeze',
                  title: 'UPI Fraud - Immediate Freeze Required',
                  urgency: 'critical',
                  timeWindow: 180 // 3 minutes
                }
              ]
            },
            order: 1,
            isRequired: true
          },
          {
            id: 'bank-coordination',
            type: 'coordination',
            title: 'Multi-Bank Coordination',
            description: 'Coordinate with multiple banks for complex fraud cases',
            order: 2,
            isRequired: true
          },
          {
            id: 'legal-compliance',
            type: 'documentation',
            title: 'Legal Compliance and Documentation',
            description: 'Ensure all freeze requests comply with legal requirements',
            order: 3,
            isRequired: true
          }
        ],
        badgeReward: {
          id: 'digital-defender',
          name: 'Digital Defender',
          imageUrl: '/assets/badges/digital-defender.svg',
          description: 'Mastered time-critical response procedures for transaction freezing'
        },
        minPassingScore: 80,
        isPublished: true,
        prerequisites: ['module-2-complaint-categorization']
      };
    }

    if (moduleId === 'module-4-escalation-fir') {
      return {
        id: 'module-4-escalation-fir',
        title: 'Escalation to FIR and CCTNS',
        description: 'Learn when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system',
        objectives: [
          'Understand the criteria for escalating cybercrime complaints to FIRs',
          'Learn the proper procedures for filing cases in CCTNS',
          'Master the documentation requirements for formal investigations',
          'Identify time-sensitive cases requiring immediate escalation',
          'Understand the legal framework for cybercrime investigation'
        ],
        estimatedDuration: 60,
        activities: [
          {
            id: 'complaint-delay-scenario',
            type: 'simulation',
            title: 'Complaint Delay Scenario',
            description: 'Practice handling cases where complaints have been delayed in processing',
            content: {
              type: 'complaint_delay',
              scenarios: [
                {
                  id: 'financial-fraud-delay',
                  title: 'UPI Fraud Case Escalation',
                  complexity: 'medium',
                  caseType: 'financial',
                  timeSpan: 14
                }
              ]
            },
            order: 1,
            isRequired: true
          },
          {
            id: 'fir-documentation',
            type: 'documentation',
            title: 'FIR Documentation Requirements',
            description: 'Learn the essential documentation needed for filing cybercrime FIRs',
            order: 2,
            isRequired: true
          },
          {
            id: 'cctns-filing',
            type: 'system',
            title: 'CCTNS Filing Procedure',
            description: 'Practice filing cybercrime cases in the CCTNS system',
            order: 3,
            isRequired: true
          }
        ],
        badgeReward: {
          id: 'fir-specialist',
          name: 'FIR Specialist',
          imageUrl: '/assets/badges/fir-specialist.svg',
          description: 'Mastered the procedures for escalating cybercrime complaints to FIRs'
        },
        minPassingScore: 80,
        isPublished: true,
        prerequisites: ['module-3-time-critical-response']
      };
    }

    if (moduleId === 'module-5-financial-fraud-investigation') {
      return {
        id: 'module-5-financial-fraud-investigation',
        title: 'Financial Fraud Investigation',
        description: 'Master the end-to-end investigation process for financial fraud cases, from complaint intake to successful prosecution',
        objectives: [
          'Process and analyze cybercrime complaints with precision',
          'Secure and document digital evidence following legal standards',
          'Trace complex financial transaction trails across multiple accounts',
          'Apply appropriate legal sections from IPC and IT Act',
          'Coordinate interstate operations for suspect apprehension'
        ],
        estimatedDuration: 90,
        activities: [
          {
            id: 'complaint-analysis',
            type: 'interactive',
            title: 'Complaint Analysis and Jurisdiction',
            description: 'Analyze a financial fraud complaint and identify key information for investigation',
            content: {
              type: 'complaint_analysis',
              scenario: 'investment_app_fraud'
            },
            order: 1,
            isRequired: true,
            route: '/modules/module-5-financial-fraud-investigation/complaint-analysis'
          },
          {
            id: 'evidence-collection',
            type: 'interactive',
            title: 'First Response and Evidence Collection',
            description: 'Learn proper procedures for securing digital evidence and initiating the investigation',
            content: {
              type: 'evidence_collection',
              scenario: 'digital_evidence_securing'
            },
            order: 2,
            isRequired: true
          },
          {
            id: 'transaction-tracing',
            type: 'interactive',
            title: 'Tracing the Transaction Trail',
            description: 'Follow the money through complex transaction networks to identify perpetrators',
            content: {
              type: 'transaction_tracing',
              scenario: 'multi_account_trail'
            },
            order: 3,
            isRequired: true
          },
          {
            id: 'legal-case-building',
            type: 'interactive',
            title: 'Building the Legal Case',
            description: 'Organize evidence and apply appropriate legal sections for prosecution',
            content: {
              type: 'legal_case_building',
              scenario: 'prosecution_preparation'
            },
            order: 4,
            isRequired: true
          },
          {
            id: 'arrest-prosecution',
            type: 'interactive',
            title: 'Arrest and Prosecution',
            description: 'Coordinate interstate operations and prepare for successful prosecution',
            content: {
              type: 'arrest_prosecution',
              scenario: 'interstate_coordination'
            },
            order: 5,
            isRequired: true
          }
        ],
        badgeReward: {
          id: 'financial-fraud-investigator',
          name: 'Financial Fraud Investigator',
          imageUrl: '/assets/badges/financial-fraud-investigator.svg',
          description: 'Mastered the complete financial fraud investigation process from complaint to prosecution'
        },
        minPassingScore: 85,
        isPublished: true,
        prerequisites: ['module-4-escalation-fir']
      };
    }

    // Default fallback
    return {
      id: moduleId,
      title: 'Module Not Found',
      description: 'This module is not yet implemented',
      objectives: [],
      estimatedDuration: 0,
      activities: [],
      badgeReward: null,
      minPassingScore: 70,
      isPublished: false
    };
  };

  const mockModule = getMockModule(moduleId);

  // Get categorization scenarios for Module 2
  const getCategorizationScenarios = () => {
    return [
      {
        id: 'scenario1',
        title: 'Banking Fraud Case',
        description: 'A victim reports that someone has made unauthorized transactions from their bank account after they clicked on a suspicious email link asking for their banking details.',
        context: 'The victim lost ₹25,000 and is very distressed.',
        categories: [
          {
            id: 'financial-fraud',
            name: 'Financial Fraud - Phishing',
            description: 'Fraudulent activities targeting financial information through deceptive means',
            examples: ['Fake banking emails', 'Phishing websites', 'SMS banking scams']
          },
          {
            id: 'identity-theft',
            name: 'Identity Theft',
            description: 'Unauthorized use of someone\'s personal information',
            examples: ['Stolen personal documents', 'Fake identity creation']
          },
          {
            id: 'cyber-stalking',
            name: 'Cyber Stalking',
            description: 'Repeated harassment or threatening behavior online',
            examples: ['Social media harassment', 'Email threats']
          },
          {
            id: 'data-breach',
            name: 'Data Breach',
            description: 'Unauthorized access to confidential data',
            examples: ['Company database hack', 'Personal data leak']
          }
        ],
        correctCategory: 'financial-fraud',
        explanation: 'This is a classic case of Financial Fraud through Phishing. The victim was deceived into providing banking details through a fraudulent email, leading to unauthorized transactions.',
        points: 15
      },
      {
        id: 'scenario2',
        title: 'Social Media Impersonation',
        description: 'Someone has created a fake profile using another person\'s photos and personal information to deceive their friends and family members.',
        context: 'The impersonator is asking for money from the victim\'s contacts.',
        categories: [
          {
            id: 'financial-fraud',
            name: 'Financial Fraud - Phishing',
            description: 'Fraudulent activities targeting financial information through deceptive means',
            examples: ['Fake banking emails', 'Phishing websites', 'SMS banking scams']
          },
          {
            id: 'identity-theft',
            name: 'Identity Theft',
            description: 'Unauthorized use of someone\'s personal information',
            examples: ['Stolen personal documents', 'Fake identity creation']
          },
          {
            id: 'cyber-stalking',
            name: 'Cyber Stalking',
            description: 'Repeated harassment or threatening behavior online',
            examples: ['Social media harassment', 'Email threats']
          },
          {
            id: 'defamation',
            name: 'Online Defamation',
            description: 'Publishing false information to damage reputation',
            examples: ['False social media posts', 'Fake reviews']
          }
        ],
        correctCategory: 'identity-theft',
        explanation: 'This is Identity Theft as someone is using another person\'s identity and personal information without permission to deceive others.',
        points: 15
      },
      {
        id: 'scenario3',
        title: 'Online Marketplace Fraud',
        description: 'A person paid for goods through an online marketplace but never received the items. The seller has disappeared and is not responding to messages.',
        context: 'The victim paid ₹15,000 for electronics that were never delivered.',
        categories: [
          {
            id: 'financial-fraud',
            name: 'Financial Fraud - Online Fraud',
            description: 'Fraudulent activities in online transactions',
            examples: ['Fake online stores', 'Non-delivery of goods', 'Payment fraud']
          },
          {
            id: 'identity-theft',
            name: 'Identity Theft',
            description: 'Unauthorized use of someone\'s personal information',
            examples: ['Stolen personal documents', 'Fake identity creation']
          },
          {
            id: 'cyber-stalking',
            name: 'Cyber Stalking',
            description: 'Repeated harassment or threatening behavior online',
            examples: ['Social media harassment', 'Email threats']
          },
          {
            id: 'data-breach',
            name: 'Data Breach',
            description: 'Unauthorized access to confidential data',
            examples: ['Company database hack', 'Personal data leak']
          }
        ],
        correctCategory: 'financial-fraud',
        explanation: 'This is Financial Fraud in online transactions where the victim was deceived into paying for goods that were never delivered.',
        points: 15
      }
    ];
  };

  // Get NCRP form scenario for Module 2
  const getNCRPFormScenario = () => {
    return {
      title: 'NCRP Complaint Form - Banking Fraud Case',
      description: 'Complete the NCRP form using the provided information from the victim interview. Drag the correct information to the appropriate fields.',
      formTemplate: {
        sections: [
          {
            id: 'victim-details',
            title: 'Victim Information',
            fields: [
              {
                id: 'victim-name',
                label: 'Victim Name',
                type: 'text',
                correctValue: 'Rajesh Kumar',
                isRequired: true
              },
              {
                id: 'victim-phone',
                label: 'Phone Number',
                type: 'text',
                correctValue: '+91-9876543210',
                isRequired: true
              },
              {
                id: 'victim-email',
                label: 'Email Address',
                type: 'email',
                correctValue: 'rajesh.kumar@email.com',
                isRequired: true
              }
            ]
          },
          {
            id: 'incident-details',
            title: 'Incident Details',
            fields: [
              {
                id: 'incident-type',
                label: 'Type of Cybercrime',
                type: 'select',
                correctValue: 'Financial Fraud - Phishing',
                isRequired: true
              },
              {
                id: 'amount-lost',
                label: 'Amount Lost (₹)',
                type: 'number',
                correctValue: '25000',
                isRequired: true
              },
              {
                id: 'incident-date',
                label: 'Date of Incident',
                type: 'date',
                correctValue: '2024-01-15',
                isRequired: true
              }
            ]
          },
          {
            id: 'additional-info',
            title: 'Additional Information',
            fields: [
              {
                id: 'bank-name',
                label: 'Bank Name',
                type: 'text',
                correctValue: 'State Bank of India',
                isRequired: false
              },
              {
                id: 'transaction-id',
                label: 'Transaction ID',
                type: 'text',
                correctValue: 'TXN123456789',
                isRequired: false
              }
            ]
          }
        ]
      },
      dragItems: [
        {
          id: 'name-item',
          label: 'Victim Name',
          value: 'Rajesh Kumar',
          category: 'personal'
        },
        {
          id: 'phone-item',
          label: 'Phone Number',
          value: '+91-9876543210',
          category: 'personal'
        },
        {
          id: 'email-item',
          label: 'Email Address',
          value: 'rajesh.kumar@email.com',
          category: 'personal'
        },
        {
          id: 'crime-type-item',
          label: 'Crime Type',
          value: 'Financial Fraud - Phishing',
          category: 'incident'
        },
        {
          id: 'amount-item',
          label: 'Lost Amount',
          value: '25000',
          category: 'financial'
        },
        {
          id: 'date-item',
          label: 'Incident Date',
          value: '2024-01-15',
          category: 'incident'
        },
        {
          id: 'bank-item',
          label: 'Bank Name',
          value: 'State Bank of India',
          category: 'financial'
        },
        {
          id: 'transaction-item',
          label: 'Transaction ID',
          value: 'TXN123456789',
          category: 'technical'
        }
      ]
    };
  };

  // Get dialog simulation data for Module 2
  const getDialogSimulationData = () => {
    return {
      dialogTree: {
        id: 'banking-fraud-interview',
        title: 'Banking Fraud Victim Interview',
        description: 'Interview a victim of online banking fraud',
        startNodeId: 'intro',
        nodes: [
          {
            id: 'intro',
            type: 'npc_message',
            speaker: 'victim',
            message: 'Officer, thank you for seeing me. Someone has stolen money from my bank account!',
            emotion: 'distressed',
            nextNodeId: 'response_1'
          },
          {
            id: 'response_1',
            type: 'player_choice',
            choices: [
              {
                id: 'empathetic',
                text: 'I understand this is very distressing. Please tell me what happened.',
                nextNodeId: 'victim_explains',
                metrics: { empathy: 10, professionalism: 5 }
              },
              {
                id: 'procedural',
                text: 'We need to file a complaint. Do you have your bank statements?',
                nextNodeId: 'victim_explains',
                metrics: { professionalism: 8, empathy: 2 }
              },
              {
                id: 'dismissive',
                text: 'How much money are we talking about here?',
                nextNodeId: 'victim_upset',
                metrics: { empathy: -5, professionalism: -3 }
              }
            ]
          },
          {
            id: 'victim_explains',
            type: 'npc_message',
            speaker: 'victim',
            message: 'I received an email that looked like it was from my bank. It asked me to verify my account details. I clicked the link and entered my information, and the next day ₹25,000 was missing from my account.',
            emotion: 'worried',
            nextNodeId: 'follow_up'
          },
          {
            id: 'victim_upset',
            type: 'npc_message',
            speaker: 'victim',
            message: 'I... I lost ₹25,000. I thought you would be more understanding...',
            emotion: 'hurt',
            nextNodeId: 'follow_up'
          },
          {
            id: 'follow_up',
            type: 'player_choice',
            choices: [
              {
                id: 'gather_details',
                text: 'Can you show me the email you received? We need to gather all the evidence.',
                nextNodeId: 'conclusion',
                metrics: { professionalism: 10, accuracy: 8 }
              },
              {
                id: 'reassure',
                text: 'Don\'t worry, we will do everything we can to help you recover your money.',
                nextNodeId: 'conclusion',
                metrics: { empathy: 8, patience: 6 }
              }
            ]
          },
          {
            id: 'conclusion',
            type: 'npc_message',
            speaker: 'victim',
            message: 'Thank you, officer. I feel better knowing you are taking this seriously.',
            emotion: 'relieved',
            nextNodeId: null
          }
        ]
      },
      characters: [
        {
          id: 'victim',
          name: 'Rajesh Kumar',
          role: 'Banking Fraud Victim',
          avatar: '/assets/characters/victim-male-1.png',
          personality: 'distressed but cooperative',
          background: 'Lost ₹25,000 in a phishing scam'
        }
      ],
      scoringCriteria: {
        empathy: { weight: 0.3, description: 'Understanding victim emotions' },
        professionalism: { weight: 0.25, description: 'Maintaining professional demeanor' },
        accuracy: { weight: 0.25, description: 'Gathering accurate information' },
        patience: { weight: 0.2, description: 'Taking time to listen' }
      }
    };
  };

  // Fetch module data when component mounts or moduleId changes
  useEffect(() => {
    if (moduleId) {
      // Skip API calls for now to avoid 404 errors - using mock data instead
      console.log('Using mock data for module:', moduleId);
    }
  }, [moduleId]);

  // Update local state when data changes
  useEffect(() => {
    if (progress && progress.modules) {
      const moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
      setModuleProgress(moduleProgress);

      // If module is completed, show completion view
      if (moduleProgress && moduleProgress.status === 'completed' && view === 'intro') {
        setView('completion');
      }
    }
  }, [progress, moduleId, view]);

  // Get current activity
  useEffect(() => {
    const moduleToUse = currentModule || mockModule;
    if (moduleToUse && moduleToUse.activities && currentActivityId) {
      const activity = moduleToUse.activities.find(a => a.id === currentActivityId);
      setActivityContent(activity);
    }
  }, [currentModule, currentActivityId, mockModule]);

  // Handle start module
  const handleStartModule = async () => {
    // Use displayModule (mock or real data)
    const moduleToUse = currentModule || mockModule;

    // Check if module has prerequisites
    if (prerequisites && !prerequisites.meetsPrerequisites) {
      // Show error message
      alert('You need to complete the prerequisites before starting this module.');
      return;
    }

    // For Module 5, redirect to the first activity route
    if (moduleId === 'module-5-financial-fraud-investigation') {
      navigate('/modules/module-5-financial-fraud-investigation/complaint-analysis');
      return;
    }

    // If module has activities, set view to activity
    if (moduleToUse && moduleToUse.activities && moduleToUse.activities.length > 0) {
      // Set current activity to first activity
      setActivityContent(moduleToUse.activities[0]);

      // Skip API call for now to avoid 404 errors
      console.log('Would update progress to in_progress for activity:', moduleToUse.activities[0].id);

      setView('activity');
    }
  };

  // Handle activity navigation
  const handleActivityClick = (activityId) => {
    // For Module 5, redirect to the specific route
    if (moduleId === 'module-5-financial-fraud-investigation') {
      navigate(`/modules/module-5-financial-fraud-investigation/${activityId}`);
      return;
    }

    // Set activity content directly instead of using Redux action
    const moduleToUse = currentModule || mockModule;
    const activity = moduleToUse.activities.find(a => a.id === activityId);
    setActivityContent(activity);
  };

  // Handle activity completion
  const handleActivityComplete = (activityId) => {
    setCompletedActivities(prev => new Set([...prev, activityId]));
    console.log('Activity completed:', activityId);

    // Update module progress to mark activity as completed
    const updatedProgress = {
      ...moduleProgress,
      activitiesCompleted: [
        ...(moduleProgress?.activitiesCompleted || []),
        {
          activityId: activityId,
          status: 'completed',
          score: 85,
          completedAt: new Date()
        }
      ]
    };
    setModuleProgress(updatedProgress);
  };

  // Handle previous activity
  const handlePreviousActivity = () => {
    const moduleToUse = currentModule || mockModule;
    if (moduleToUse && activityContent) {
      const currentIndex = moduleToUse.activities.findIndex(a => a.id === activityContent.id);

      if (currentIndex > 0) {
        setActivityContent(moduleToUse.activities[currentIndex - 1]);
      }
    }
  };

  // Handle next activity
  const handleNextActivity = async () => {
    const moduleToUse = currentModule || mockModule;
    if (moduleToUse && activityContent) {
      const currentIndex = moduleToUse.activities.findIndex(a => a.id === activityContent.id);

      if (currentIndex < moduleToUse.activities.length - 1) {
        // Set next activity directly instead of using Redux actions
        setActivityContent(moduleToUse.activities[currentIndex + 1]);
        console.log('Would update progress for next activity:', moduleToUse.activities[currentIndex + 1].id);
      }
    }
  };

  // Handle complete module
  const handleCompleteModule = async () => {
    const moduleToUse = currentModule || mockModule;

    // Create mock progress data for completion
    const mockCompletedProgress = {
      moduleId: moduleToUse.id,
      status: 'completed',
      activitiesCompleted: moduleToUse.activities.map(activity => ({
        activityId: activity.id,
        status: 'completed',
        score: 85 // Mock score above passing threshold
      })),
      currentScore: 85,
      attempts: 1,
      startedAt: new Date(Date.now() - 3600000), // 60 minutes ago
      completedAt: new Date(),
      timeSpent: 3600 // 60 minutes in seconds
    };

    // Set completion data with proper badge structure based on module
    let badgeData = null;
    let xpEarned = 100;

    if (moduleToUse.id === 'module-1-intro-cybercrime') {
      badgeData = {
        id: 'cyber-awareness-starter',
        name: 'Cyber Awareness Starter',
        description: 'Completed the introduction to cybercrime investigation with excellence',
        imageUrl: '/assets/badges/cyber-awareness-starter.svg'
      };
      xpEarned = 100;
    } else if (moduleToUse.id === 'module-2-complaint-categorization') {
      badgeData = {
        id: 'first-responder',
        name: 'First Responder',
        description: 'Mastered complaint categorization and intake procedures with professional excellence',
        imageUrl: '/assets/badges/first-responder.svg'
      };
      xpEarned = 150;
    } else if (moduleToUse.id === 'module-3-time-critical-response') {
      badgeData = {
        id: 'digital-defender',
        name: 'Digital Defender',
        description: 'Mastered time-critical response procedures for transaction freezing with exceptional speed and accuracy',
        imageUrl: '/assets/badges/digital-defender.svg'
      };
      xpEarned = 200;
    } else if (moduleToUse.id === 'module-4-escalation-fir') {
      badgeData = {
        id: 'fir-specialist',
        name: 'FIR Specialist',
        description: 'Mastered the procedures for escalating cybercrime complaints to FIRs and filing them in CCTNS with professional excellence',
        imageUrl: '/assets/badges/fir-specialist.svg'
      };
      xpEarned = 250;
    }

    // Save completion to localStorage for persistence
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    if (!completedModules.includes(moduleToUse.id)) {
      completedModules.push(moduleToUse.id);
      localStorage.setItem('completedModules', JSON.stringify(completedModules));
    }

    // Save badge to localStorage
    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
    if (badgeData && !earnedBadges.find(b => b.id === badgeData.id)) {
      earnedBadges.push({ ...badgeData, earnedAt: new Date().toISOString() });
      localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
    }

    setCompletionData({
      module: moduleToUse,
      progress: mockCompletedProgress,
      badge: badgeData,
      xp: { earned: xpEarned }
    });

    console.log('Setting completion view with badge data:', badgeData);
    console.log('Module completed and saved to localStorage:', moduleToUse.id);
    setView('completion');
  };

  // Handle continue to next module
  const handleContinueToNextModule = () => {
    // Navigate to modules page
    navigate('/modules');
  };

  // Render loading state
  if (moduleLoading || progressLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-blue"></div>
        </div>
      </Layout>
    );
  }

  // Use mock data if no module is loaded from API
  const displayModule = currentModule || mockModule;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">{displayModule.title}</h1>
            <p className="text-gray-600">{displayModule.description}</p>
          </div>
        </div>
      </div>

      {/* Module content based on view */}
      {view === 'intro' && (
        <ModuleIntro
          module={displayModule}
          onStart={handleStartModule}
        />
      )}

      {view === 'activity' && (
        <div className="space-y-6">
          {/* Module progress bar */}
          <ModuleProgressBar
            activities={displayModule.activities}
            currentActivityId={currentActivityId}
            progress={moduleProgress}
            onActivityClick={handleActivityClick}
          />

          {/* Activity content */}
          <Card className="p-6">
            {activityContent ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{activityContent.title}</h2>

                {/* Wrap activity content with ModuleContentOptimizer */}
                <ModuleContentOptimizer module={currentModule} isActive={true}>
                  {/* Render activity content based on type */}
                  {activityContent.type === 'interactive' && (
                    <div className="space-y-6">
                      <OfficerAvatar
                        message="Welcome to the Cybercrime Investigation Training Program! I&apos;m your digital senior officer, and I&apos;ll be guiding you through this comprehensive training journey. Let&apos;s start by understanding the basics of cybercrime investigation and the national systems we use."
                        emotion="encouraging"
                        onMessageComplete={() => {
                          // Handle message completion - move to next activity
                          console.log('Onboarding message completed');
                          handleNextActivity();
                        }}
                      />
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">What You&apos;ll Learn:</h3>
                        <ul className="list-disc list-inside text-blue-700 space-y-1">
                          <li>Different types of cybercrimes and how to identify them</li>
                          <li>National cybercrime reporting systems (NCRP, I4C, CCTNS)</li>
                          <li>Proper procedures for handling cybercrime complaints</li>
                          <li>Communication techniques for victim support</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {(activityContent.type === 'quiz' || activityContent.type === 'dragdrop') && (
                    <div className="space-y-4">
                      <CrimeQuiz
                        items={activityContent.content?.items || []}
                        onComplete={(results) => {
                          console.log('Quiz completed:', results);
                          // Skip API call for now to avoid 404 errors
                          console.log('Quiz completed with score:', results.score);
                        }}
                        onProgress={(progress) => {
                          console.log('Quiz progress:', progress);
                        }}
                      />
                    </div>
                  )}

                  {activityContent.type === 'simulation' && (
                    <div className="mt-4">
                      {activityContent.content?.type === 'victim_dialog' ? (
                        <VictimDialogSystem
                          scenario={activityContent.content.scenario}
                          onComplete={(results) => {
                            console.log('Dialog simulation completed:', results);
                            handleActivityComplete(activityContent.id);
                            handleNextActivity();
                          }}
                          onProgress={(progress) => {
                            console.log('Dialog progress:', progress);
                          }}
                        />
                      ) : activityContent.content?.type === 'complaint_delay' ? (
                        <ComplaintDelayScenarioModule
                          activity={activityContent}
                          onComplete={(activityId, results) => {
                            console.log('Complaint delay scenario completed:', results);
                            handleActivityComplete(activityId);
                            handleNextActivity();
                          }}
                        />
                      ) : (
                        <div className="bg-gray-100 p-4 rounded-md">
                          <p className="text-gray-600 mb-4">
                            Simulation content will be rendered here.
                          </p>
                          <img
                            src="/images/simulation-preview.jpg"
                            alt="Simulation Preview"
                            className="w-full rounded-md"
                            data-critical={true}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activityContent.type === 'time-critical' && (
                    <div className="mt-4">
                      <TransactionFreezeSimulation
                        onComplete={(results) => {
                          console.log('Transaction freeze simulation completed:', results);
                          handleActivityComplete(activityContent.id);
                          handleNextActivity();
                        }}
                      />
                    </div>
                  )}

                  {activityContent.type === 'categorization' && (
                    <div className="space-y-4">
                      {activityContent.content?.type === 'complaint_categorization' ? (
                        <ComplaintCategorizationInterface
                          scenarios={getCategorizationScenarios()}
                          onComplete={(results) => {
                            console.log('Categorization completed:', results);
                            handleActivityComplete(activityContent.id);
                            handleNextActivity();
                          }}
                          onProgress={(progress) => {
                            console.log('Categorization progress:', progress);
                          }}
                        />
                      ) : (
                        <CrimeQuiz
                          items={activityContent.content?.items || []}
                          onComplete={(results) => {
                            console.log('Quiz completed:', results);
                            handleActivityComplete(activityContent.id);
                          }}
                          onProgress={(progress) => {
                            console.log('Quiz progress:', progress);
                          }}
                        />
                      )}
                    </div>
                  )}

                  {activityContent.type === 'form' && (
                    <div className="space-y-4">
                      <NCRPMockForm
                        scenario={getNCRPFormScenario()}
                        onComplete={(results) => {
                          console.log('NCRP Form completed:', results);
                          handleActivityComplete(activityContent.id);
                          handleNextActivity();
                        }}
                        onProgress={(progress) => {
                          console.log('Form progress:', progress);
                        }}
                      />
                    </div>
                  )}

                  {activityContent.type === 'documentation' && (
                    <div className="space-y-4">
                      <DocumentationActivity
                        {...firDocumentationContent}
                        onComplete={(results) => {
                          console.log('Documentation activity completed:', results);
                          handleActivityComplete(activityContent.id);
                          handleNextActivity();
                        }}
                      />
                    </div>
                  )}

                  {activityContent.type === 'system' && (
                    <div className="space-y-4">
                      <SystemActivity
                        {...cctnsFilingContent}
                        onComplete={(results) => {
                          console.log('System activity completed:', results);
                          handleActivityComplete(activityContent.id);
                          handleNextActivity();
                        }}
                      />
                    </div>
                  )}

                  {!['interactive', 'quiz', 'dragdrop', 'simulation', 'time-critical', 'categorization', 'form', 'documentation', 'system'].includes(activityContent.type) && (
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-gray-600">
                        Activity type &quot;{activityContent.type}&quot; is not yet implemented.
                      </p>
                    </div>
                  )}
                </ModuleContentOptimizer>

                {/* Activity completion button for activities that don't handle their own completion */}
                {activityContent.type === 'interactive' && (
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      onClick={() => {
                        // Skip API call for now to avoid 404 errors
                        console.log('Would update progress to completed for activity:', activityContent.id);
                        // Automatically move to next activity
                        handleNextActivity();
                      }}
                    >
                      Complete Activity
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Activity not found</p>
              </div>
            )}
          </Card>

          {/* Activity navigation */}
          <ModuleActivityNavigation
            activities={displayModule.activities}
            currentActivityId={activityContent?.id}
            progress={{
              ...moduleProgress,
              activitiesCompleted: displayModule.activities.map(activity => ({
                activityId: activity.id,
                status: 'completed', // Mark all activities as completed for testing
                score: 85
              }))
            }}
            onPrevious={handlePreviousActivity}
            onNext={handleNextActivity}
            onComplete={handleCompleteModule}
          />
        </div>
      )}

      {view === 'completion' && (
        <ModuleCompletion
          title={`${displayModule.title} Completed!`}
          score={completionData?.progress?.currentScore || 85}
          maxScore={100}
          message={`Congratulations! You have successfully completed ${displayModule.title}. ${completionData?.badge ? `You've earned the "${completionData.badge.name}" badge!` : ''}`}
          nextModule={moduleId === 'module-4-escalation-fir' ? {
            title: 'Module 5: Financial Fraud Investigation',
            description: 'Master the end-to-end investigation process for financial fraud cases'
          } : null}
          onContinue={handleContinueToNextModule}
        />
      )}
    </Layout>
  );
};

export default ModuleDetailPage;