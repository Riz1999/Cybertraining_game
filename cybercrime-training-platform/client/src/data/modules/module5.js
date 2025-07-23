/**
 * Module 5: Financial Fraud Investigation
 * 
 * This module guides officers through the complete investigation process
 * of a financial fraud case, from initial complaint to prosecution.
 */

const module5 = {
  id: 'module-5-financial-fraud-investigation',
  title: 'Financial Fraud Investigation',
  description: 'Master the end-to-end investigation process for financial fraud cases, from complaint intake to successful prosecution.',
  introduction: {
    title: 'Financial Fraud Investigation',
    content: `<p>Financial fraud cases require a systematic investigation approach that combines technical analysis, legal knowledge, and procedural expertise.</p>
              <p>In this module, you will work through a complete financial fraud case involving UPI transactions, mule accounts, and interstate coordination.</p>
              <p>You'll learn how to properly document evidence, trace financial transactions, build a legal case, and coordinate for arrest and prosecution.</p>`,
    objectives: [
      'Process and analyze cybercrime complaints with precision',
      'Secure and document digital evidence following legal standards',
      'Trace complex financial transaction trails across multiple accounts',
      'Apply appropriate legal sections from IPC and IT Act',
      'Coordinate interstate operations for suspect apprehension'
    ],
    duration: 90,
    prerequisites: [
      {
        moduleId: 'module-4-escalation-fir',
        title: 'Escalation to FIR and CCTNS',
        reason: 'Understanding FIR filing procedures is essential before conducting full investigations.'
      }
    ],
    badgeReward: {
      name: 'Financial Fraud Investigator',
      description: 'Awarded for mastering the complete financial fraud investigation process',
      imageUrl: '/assets/badges/financial-fraud-investigator.svg'
    }
  },
  activities: [
    {
      id: 'complaint-analysis',
      title: 'Complaint Analysis and Jurisdiction',
      description: 'Analyze a financial fraud complaint and identify key information for investigation.',
      type: 'interactive',
      estimatedTime: 15,
      points: 50,
      status: 'available'
    },
    {
      id: 'evidence-collection',
      title: 'First Response and Evidence Collection',
      description: 'Learn proper procedures for securing digital evidence and initiating the investigation.',
      type: 'interactive',
      estimatedTime: 20,
      points: 70,
      status: 'locked',
      dependsOn: ['complaint-analysis']
    },
    {
      id: 'transaction-tracing',
      title: 'Tracing the Transaction Trail',
      description: 'Follow the money through complex transaction networks to identify perpetrators.',
      type: 'interactive',
      estimatedTime: 25,
      points: 100,
      status: 'locked',
      dependsOn: ['evidence-collection']
    },
    {
      id: 'legal-case-building',
      title: 'Building the Legal Case',
      description: 'Organize evidence and apply appropriate legal sections for prosecution.',
      type: 'interactive',
      estimatedTime: 15,
      points: 100,
      status: 'locked',
      dependsOn: ['transaction-tracing']
    },
    {
      id: 'arrest-prosecution',
      title: 'Arrest and Prosecution',
      description: 'Coordinate interstate operations and prepare for successful prosecution.',
      type: 'interactive',
      estimatedTime: 15,
      points: 150,
      status: 'locked',
      dependsOn: ['legal-case-building']
    }
  ],
  completion: {
    certificateTitle: 'Financial Fraud Investigation Specialist',
    certificateDescription: 'Has demonstrated proficiency in investigating complex financial fraud cases',
    minimumPassingScore: 85
  }
};

export default module5;