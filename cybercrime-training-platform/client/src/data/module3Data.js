/**
 * Module 3: Time-Critical Response - Transaction Freezing Data
 * Contains time-bound scenarios for transaction freezing procedures
 */

export const module3Data = {
  id: 'module-3-time-critical-response',
  title: 'Time-Critical Response: Transaction Freezing',
  description: 'Master time-bound responses to fraudulent transactions and learn to effectively stop fund transfers',
  estimatedDuration: 45, // minutes
  difficulty: 'intermediate',
  minPassingScore: 80,
  prerequisites: ['module-2-complaint-categorization'],
  
  // Learning objectives
  objectives: [
    'Execute time-critical transaction freezing procedures',
    'Identify key banking information required for freeze requests',
    'Navigate banking APIs and freeze request systems',
    'Manage time pressure while maintaining accuracy',
    'Understand legal requirements for transaction holds'
  ],

  // Module activities
  activities: [
    {
      id: 'transaction-freeze-simulation',
      title: 'Transaction Freeze Simulation',
      type: 'time-critical',
      description: 'Practice freezing fraudulent transactions within critical time windows',
      points: 100,
      timeLimit: 300, // 5 minutes per scenario
      content: {
        scenarios: [
          {
            id: 'upi-fraud-freeze',
            title: 'UPI Fraud - Immediate Freeze Required',
            urgency: 'critical',
            timeWindow: 180, // 3 minutes
            complaint: {
              amount: 50000,
              transactionId: 'TXN789456123',
              victimBank: 'State Bank of India',
              victimAccount: '1234567890',
              suspectUPI: 'fraud@paytm',
              reportTime: '2024-01-15T14:30:00Z',
              transactionTime: '2024-01-15T14:25:00Z'
            },
            requiredActions: [
              'Identify victim bank details',
              'Locate transaction UTR number',
              'Select appropriate freeze API',
              'Submit freeze request',
              'Verify freeze confirmation'
            ],
            bankingAPIs: [
              { id: 'sbi-freeze', name: 'SBI Transaction Freeze', correct: true },
              { id: 'hdfc-freeze', name: 'HDFC Freeze System', correct: false },
              { id: 'icici-freeze', name: 'ICICI Hold Request', correct: false },
              { id: 'generic-freeze', name: 'Generic Bank API', correct: false }
            ]
          },
          {
            id: 'credit-card-fraud',
            title: 'Credit Card Fraud - Multi-Bank Coordination',
            urgency: 'high',
            timeWindow: 240, // 4 minutes
            complaint: {
              amount: 125000,
              transactionId: 'CC987654321',
              victimBank: 'HDFC Bank',
              victimCard: '4532-****-****-7890',
              merchantDetails: 'Online Shopping Portal',
              reportTime: '2024-01-15T16:45:00Z',
              transactionTime: '2024-01-15T16:30:00Z'
            },
            requiredActions: [
              'Identify card issuing bank',
              'Locate merchant acquiring bank',
              'Coordinate with both banks',
              'Submit dual freeze requests',
              'Monitor freeze status'
            ]
          }
        ]
      }
    },
    {
      id: 'bank-coordination',
      title: 'Multi-Bank Coordination',
      type: 'coordination',
      description: 'Coordinate with multiple banks for complex fraud cases',
      points: 100,
      timeLimit: 600, // 10 minutes
      content: {
        bankContacts: [
          { name: 'State Bank of India', freezeAPI: 'sbi-freeze', contact: '1800-1234-5678' },
          { name: 'HDFC Bank', freezeAPI: 'hdfc-freeze', contact: '1800-2266-4444' },
          { name: 'ICICI Bank', freezeAPI: 'icici-freeze', contact: '1800-1080-888' },
          { name: 'Axis Bank', freezeAPI: 'axis-freeze', contact: '1800-419-5959' }
        ],
        complexScenarios: [
          {
            id: 'multi-bank-fraud',
            description: 'Fraudster used multiple accounts across 3 banks to launder ₹2,50,000',
            involvedBanks: ['SBI', 'HDFC', 'ICICI'],
            timeConstraint: 480 // 8 minutes
          }
        ]
      }
    },
    {
      id: 'legal-compliance',
      title: 'Legal Compliance and Documentation',
      type: 'documentation',
      description: 'Ensure all freeze requests comply with legal requirements',
      points: 100,
      timeLimit: 900, // 15 minutes
      content: {
        legalRequirements: [
          'Valid FIR number or complaint ID',
          'Proper authorization from investigating officer',
          'Clear justification for freeze request',
          'Time-bound nature of the request',
          'Victim consent and verification'
        ],
        documentTemplates: [
          'Freeze Request Letter',
          'Legal Authorization Form',
          'Victim Consent Form',
          'Bank Coordination Sheet'
        ]
      }
    }
  ],

  // Assessment criteria
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    scoring: {
      'transaction-freeze-simulation': {
        weight: 0.5,
        criteria: [
          { aspect: 'speed', weight: 0.4 },
          { aspect: 'accuracy', weight: 0.4 },
          { aspect: 'completeness', weight: 0.2 }
        ]
      },
      'bank-coordination': {
        weight: 0.3,
        criteria: [
          { aspect: 'coordination', weight: 0.5 },
          { aspect: 'efficiency', weight: 0.3 },
          { aspect: 'communication', weight: 0.2 }
        ]
      },
      'legal-compliance': {
        weight: 0.2,
        criteria: [
          { aspect: 'compliance', weight: 0.6 },
          { aspect: 'documentation', weight: 0.4 }
        ]
      }
    }
  },

  // Badge reward
  badgeReward: {
    id: 'digital-defender',
    name: 'Digital Defender',
    description: 'Mastered time-critical response procedures for transaction freezing',
    criteria: 'Complete Module 3 with 80% or higher score'
  },

  // Unlock requirements
  unlockRequirements: {
    prerequisiteBadge: 'first-responder',
    minimumScore: 80,
    requiredModule: 'module-2-complaint-categorization'
  }
};

export default module3Data;