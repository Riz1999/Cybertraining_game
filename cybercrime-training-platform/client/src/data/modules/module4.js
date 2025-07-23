/**
 * Module 4: Escalation to FIR and CCTNS
 * 
 * This module focuses on teaching officers when and how to escalate cybercrime complaints
 * to formal FIRs and file them in the CCTNS system.
 */

const module4Data = {
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

export default module4Data;