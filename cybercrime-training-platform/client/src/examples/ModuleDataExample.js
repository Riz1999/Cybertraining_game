/**
 * Module Data Example
 * 
 * This file demonstrates how to use the module data models and services.
 */
import { Module, Activity, Badge } from '../models/ModuleModels';
import ModuleManagementService from '../services/ModuleManagementService';

/**
 * Create example module data for the cybercrime training platform
 */
export const createExampleModuleData = () => {
  // Create badges
  const cyberAwarenessBadge = new Badge({
    name: 'Cyber Awareness Starter',
    description: 'Completed the introduction to cybercrime investigation',
    imageUrl: '/assets/badges/cyber-awareness-starter.png',
    category: 'foundation',
    points: 100,
    rarity: 'common'
  });

  const firstResponderBadge = new Badge({
    name: 'First Responder',
    description: 'Mastered complaint categorization and intake procedures',
    imageUrl: '/assets/badges/first-responder.png',
    category: 'investigation',
    points: 150,
    rarity: 'uncommon'
  });

  // Create activities for Module 1
  const onboardingActivity = new Activity({
    title: 'Interactive Onboarding with Officer Avatar',
    description: 'Meet your digital senior officer and learn about cybercrime investigation',
    type: 'interactive',
    content: {
      components: [
        {
          id: 'officer-avatar',
          type: 'avatar',
          config: {
            characterName: 'Inspector Sharma',
            avatarUrl: '/assets/avatars/inspector-sharma.png',
            dialogues: [
              'Welcome to cybercrime investigation training!',
              'I will guide you through the fundamentals of digital crime investigation.',
              'Let\'s start with understanding different types of cybercrimes.'
            ]
          }
        }
      ]
    },
    points: 50,
    timeLimit: 600, // 10 minutes
    order: 1
  });

  const crimeQuizActivity = new Activity({
    title: 'Crime or Not a Crime? Quiz',
    description: 'Test your ability to identify different types of cybercrimes',
    type: 'quiz',
    content: {
      questions: [
        {
          id: 'q1',
          question: 'A person receives a fake email asking for bank details. Is this a cybercrime?',
          type: 'multiple_choice',
          options: [
            { id: 'a', text: 'Yes, it\'s phishing', value: 'yes' },
            { id: 'b', text: 'No, it\'s just spam', value: 'no' },
            { id: 'c', text: 'Only if money is stolen', value: 'conditional' }
          ],
          correctAnswer: 'yes',
          points: 10,
          explanation: 'Phishing attempts are cybercrimes even if no money is actually stolen.'
        },
        {
          id: 'q2',
          question: 'Someone hacks into a company database but doesn\'t steal anything. Is this a crime?',
          type: 'multiple_choice',
          options: [
            { id: 'a', text: 'No, nothing was stolen', value: 'no' },
            { id: 'b', text: 'Yes, unauthorized access is illegal', value: 'yes' },
            { id: 'c', text: 'Only if data is modified', value: 'conditional' }
          ],
          correctAnswer: 'yes',
          points: 10,
          explanation: 'Unauthorized access to computer systems is illegal regardless of whether data is stolen.'
        }
      ],
      passingScore: 0.7,
      allowRetries: true,
      maxAttempts: 3
    },
    points: 75,
    timeLimit: 900, // 15 minutes
    order: 2
  });

  const systemMapActivity = new Activity({
    title: 'Cybercrime Systems Map Exploration',
    description: 'Explore the interconnected systems used in cybercrime investigation',
    type: 'interactive',
    content: {
      components: [
        {
          id: 'systems-map',
          type: 'map',
          config: {
            mapData: {
              systems: [
                {
                  id: 'ncrp',
                  name: 'NCRP',
                  description: 'National Cybercrime Reporting Portal',
                  position: { x: 100, y: 100 },
                  details: 'The primary portal for reporting cybercrimes in India'
                },
                {
                  id: 'i4c',
                  name: 'I4C',
                  description: 'Indian Cyber Crime Coordination Centre',
                  position: { x: 300, y: 100 },
                  details: 'Coordinates cybercrime investigation across states'
                },
                {
                  id: 'helpline-1930',
                  name: '1930 Helpline',
                  description: 'National Cybercrime Helpline',
                  position: { x: 200, y: 200 },
                  details: 'Immediate assistance for cybercrime victims'
                },
                {
                  id: 'cctns',
                  name: 'CCTNS',
                  description: 'Crime and Criminal Tracking Network & Systems',
                  position: { x: 400, y: 200 },
                  details: 'Comprehensive crime tracking system'
                }
              ],
              connections: [
                { from: 'ncrp', to: 'i4c' },
                { from: 'ncrp', to: 'helpline-1930' },
                { from: 'i4c', to: 'cctns' }
              ]
            }
          },
          interactions: [
            {
              id: 'click-system',
              type: 'click',
              trigger: 'system-click',
              action: 'show-details'
            }
          ]
        }
      ]
    },
    points: 100,
    timeLimit: 1200, // 20 minutes
    order: 3
  });

  // Create Module 1
  const module1 = new Module({
    title: 'Introduction to Cybercrime Investigation',
    description: 'Learn the fundamentals of cybercrime investigation and national systems',
    objectives: [
      'Understand different types of cybercrimes',
      'Learn about national cybercrime systems (NCRP, I4C, 1930, CCTNS)',
      'Develop basic investigation mindset'
    ],
    prerequisites: [], // No prerequisites for first module
    activities: [onboardingActivity, crimeQuizActivity, systemMapActivity],
    badgeReward: cyberAwarenessBadge,
    minPassingScore: 0.8,
    estimatedDuration: 45, // 45 minutes
    category: 'foundation',
    difficulty: 'beginner',
    tags: ['cybercrime', 'introduction', 'systems'],
    order: 1,
    isPublished: true
  });

  // Create activities for Module 2
  const victimDialogActivity = new Activity({
    title: 'Simulated Victim Dialog',
    description: 'Practice interviewing cybercrime victims with empathy and professionalism',
    type: 'simulation',
    content: {
      type: 'dialog',
      scenario: {
        title: 'Banking Fraud Victim Interview',
        description: 'A victim has lost ₹50,000 in an online banking fraud',
        context: 'The victim is distressed and needs careful handling'
      },
      interactions: [
        {
          id: 'intro',
          type: 'dialog',
          prompt: 'Victim: "Officer, someone has stolen money from my account!"',
          options: [
            {
              id: 'empathetic',
              text: 'I understand this is very distressing. Please tell me what happened.',
              points: 10,
              nextInteractionId: 'details'
            },
            {
              id: 'procedural',
              text: 'We need to file a complaint. Do you have your bank statements?',
              points: 5,
              nextInteractionId: 'details'
            }
          ]
        }
      ]
    },
    points: 100,
    timeLimit: 1800, // 30 minutes
    order: 1
  });

  const categorizationActivity = new Activity({
    title: 'Complaint Categorization Interface',
    description: 'Learn to categorize different types of cybercrime complaints',
    type: 'quiz',
    content: {
      questions: [
        {
          id: 'cat1',
          question: 'A victim reports unauthorized transactions from their bank account after clicking a suspicious link. How should this be categorized?',
          type: 'multiple_choice',
          options: [
            { id: 'a', text: 'Financial Fraud - Phishing', value: 'financial-phishing' },
            { id: 'b', text: 'Identity Theft', value: 'identity-theft' },
            { id: 'c', text: 'Malware Attack', value: 'malware' }
          ],
          correctAnswer: 'financial-phishing',
          points: 15,
          explanation: 'This is a classic phishing attack leading to financial fraud.'
        }
      ],
      passingScore: 0.8
    },
    points: 75,
    order: 2
  });

  const ncrpFormActivity = new Activity({
    title: 'NCRP Form Completion with Drag-and-Drop',
    description: 'Practice completing NCRP forms using drag-and-drop interface',
    type: 'simulation',
    content: {
      type: 'form',
      formTemplate: {
        title: 'NCRP Complaint Form',
        sections: [
          {
            id: 'victim-details',
            title: 'Victim Information'
          },
          {
            id: 'incident-details',
            title: 'Incident Details'
          }
        ],
        fields: [
          {
            id: 'victim-name',
            label: 'Victim Name',
            type: 'text',
            sectionId: 'victim-details',
            isRequired: true,
            correctValue: 'Rajesh Kumar'
          },
          {
            id: 'incident-type',
            label: 'Type of Cybercrime',
            type: 'select',
            sectionId: 'incident-details',
            isRequired: true,
            correctValue: 'Financial Fraud'
          },
          {
            id: 'amount-lost',
            label: 'Amount Lost (₹)',
            type: 'number',
            sectionId: 'incident-details',
            isRequired: true,
            correctValue: '50000'
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
          id: 'crime-type-item',
          label: 'Crime Type',
          value: 'Financial Fraud',
          category: 'incident'
        },
        {
          id: 'amount-item',
          label: 'Lost Amount',
          value: '50000',
          category: 'financial'
        }
      ],
      scenario: {
        title: 'Banking Fraud Case',
        description: 'Rajesh Kumar lost ₹50,000 in a phishing attack. Complete the NCRP form with the correct information.'
      }
    },
    points: 125,
    timeLimit: 1200, // 20 minutes
    order: 3
  });

  // Create Module 2
  const module2 = new Module({
    title: 'Complaint Categorization and Intake',
    description: 'Master the art of categorizing complaints and collecting accurate information',
    objectives: [
      'Conduct empathetic victim interviews',
      'Accurately categorize different types of cybercrimes',
      'Complete NCRP forms with precision'
    ],
    prerequisites: [module1.id], // Requires Module 1
    activities: [victimDialogActivity, categorizationActivity, ncrpFormActivity],
    badgeReward: firstResponderBadge,
    minPassingScore: 0.8,
    estimatedDuration: 60, // 60 minutes
    category: 'investigation',
    difficulty: 'intermediate',
    tags: ['complaint-handling', 'ncrp', 'categorization'],
    order: 2,
    isPublished: true
  });

  return {
    modules: [module1, module2],
    badges: [cyberAwarenessBadge, firstResponderBadge],
    activities: [
      onboardingActivity, crimeQuizActivity, systemMapActivity,
      victimDialogActivity, categorizationActivity, ncrpFormActivity
    ]
  };
};

/**
 * Example of how to use the ModuleManagementService
 */
export const demonstrateModuleManagement = async () => {
  // Create service instance
  const moduleService = new ModuleManagementService();

  // Create example data
  const exampleData = createExampleModuleData();

  // Initialize service with data
  await moduleService.initialize({
    modules: exampleData.modules,
    badges: exampleData.badges
  });

  // Example user progress
  const userProgress = {
    modules: {
      [exampleData.modules[0].id]: {
        status: 'completed',
        score: 0.85,
        timeSpent: 2700, // 45 minutes
        completedAt: new Date()
      }
    },
    activities: {},
    badges: [exampleData.badges[0]]
  };

  // Get available modules for user
  const availableModules = moduleService.getAvailableModules(userProgress);
  console.log('Available modules:', availableModules.map(m => m.title));

  // Get next recommended module
  const nextModule = moduleService.getNextRecommendedModule(userProgress);
  console.log('Next recommended module:', nextModule?.title);

  // Check if user can start Module 2
  const canStartModule2 = moduleService.canUserStartModule(exampleData.modules[1].id, userProgress);
  console.log('Can start Module 2:', canStartModule2);

  // Get learning path
  const learningPath = moduleService.getLearningPath(userProgress);
  console.log('Learning path:', learningPath.map(m => m.title));

  // Get statistics
  const stats = moduleService.getStatistics();
  console.log('System statistics:', stats);

  // Validate system integrity
  const validation = moduleService.validateSystem();
  console.log('System validation:', validation);

  return {
    moduleService,
    exampleData,
    userProgress,
    availableModules,
    nextModule,
    canStartModule2,
    learningPath,
    stats,
    validation
  };
};

export default {
  createExampleModuleData,
  demonstrateModuleManagement
};