/**
 * Sample Decision Tree for Module 4: Escalation to FIR and CCTNS
 * 
 * This file contains a sample decision tree that demonstrates the decision-based
 * scenario system for cybercrime investigation training.
 */

export const module4DecisionTree = {
  id: 'module-4-escalation-fir',
  title: 'Escalation to FIR and CCTNS',
  description: 'Learn when and how to escalate complaints to FIR filing in CCTNS',
  context: 'You are a cybercrime officer handling various complaint scenarios. Your decisions will affect the investigation outcome and victim satisfaction.',
  decisionPoints: [
    {
      id: 'initial-complaint-delay',
      title: 'Complaint Delay Scenario',
      description: 'A victim reports a financial fraud case',
      context: 'A victim approaches you with a complaint about unauthorized transactions from their bank account. The incident occurred 3 days ago.',
      scenario: 'Mrs. Sharma reports that ₹50,000 was transferred from her savings account to an unknown account 3 days ago. She noticed it today when checking her bank statement. She has all the transaction details and wants immediate action. The bank has not been contacted yet.',
      timeLimit: 120, // 2 minutes
      options: [
        {
          id: 'escalate-immediately',
          text: 'Escalate to FIR immediately',
          description: 'File an FIR right away given the significant amount involved',
          points: 15,
          feedback: 'Good decision! For amounts above ₹20,000, immediate FIR filing ensures proper investigation channels are activated.',
          consequences: [
            {
              type: 'positive',
              description: 'Investigation begins immediately with proper legal backing',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'positive',
              description: 'Bank cooperation is secured through official channels',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'cctns-interface-walkthrough',
          isOptimal: true,
          category: 'escalate'
        },
        {
          id: 'wait-for-more-info',
          text: 'Wait and gather more information',
          description: 'Ask the victim to collect more details before proceeding',
          points: 5,
          feedback: 'While gathering information is important, the 72-hour window for transaction reversal is critical. Time is of the essence.',
          consequences: [
            {
              type: 'negative',
              description: 'Valuable time lost in the critical 72-hour window',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'neutral',
              description: 'More information gathered, but investigation delayed',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'delayed-action-consequences',
          isOptimal: false,
          category: 'wait'
        },
        {
          id: 'register-ncrp-only',
          text: 'Register on NCRP and monitor',
          description: 'Register the complaint on NCRP portal and wait for developments',
          points: 8,
          feedback: 'NCRP registration is good for tracking, but given the amount and timeline, FIR filing would be more appropriate.',
          consequences: [
            {
              type: 'neutral',
              description: 'Complaint is officially recorded in the system',
              impact: 'medium',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Limited investigation powers without FIR',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'ncrp-limitations',
          isOptimal: false,
          category: 'file_fir'
        }
      ]
    },
    {
      id: 'cctns-interface-walkthrough',
      title: 'CCTNS FIR Filing Process',
      description: 'Navigate the CCTNS interface for FIR filing',
      context: 'You have decided to file an FIR. Now you need to properly enter the case details in CCTNS.',
      scenario: 'You are now at the CCTNS terminal. The victim is waiting while you prepare to file the FIR. You need to select the appropriate sections and categories for this cybercrime case.',
      timeLimit: 180, // 3 minutes
      options: [
        {
          id: 'section-420-66c',
          text: 'File under IPC 420 and IT Act 66C',
          description: 'Cheating and identity theft sections',
          points: 20,
          feedback: 'Excellent! IPC 420 covers cheating and IT Act 66C covers identity theft and fraud. This is the correct legal framework.',
          consequences: [
            {
              type: 'positive',
              description: 'Proper legal sections ensure comprehensive investigation',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'positive',
              description: 'Court proceedings will have solid legal foundation',
              impact: 'high',
              delay: 2000
            }
          ],
          nextDecisionId: 'investigation-priority',
          isOptimal: true,
          category: 'file_fir'
        },
        {
          id: 'section-379-only',
          text: 'File under IPC 379 (Theft) only',
          description: 'Simple theft case filing',
          points: 5,
          feedback: 'IPC 379 is insufficient for cybercrime cases. You need IT Act sections for proper jurisdiction and investigation.',
          consequences: [
            {
              type: 'negative',
              description: 'Limited investigation scope due to incorrect sections',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'May need to amend FIR later, causing delays',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'section-amendment-needed',
          isOptimal: false,
          category: 'file_fir'
        },
        {
          id: 'it-act-only',
          text: 'File under IT Act 66D only',
          description: 'Focus only on IT Act provisions',
          points: 10,
          feedback: 'IT Act 66D is relevant, but combining with IPC sections provides better legal coverage for prosecution.',
          consequences: [
            {
              type: 'neutral',
              description: 'Cybercrime aspects covered but traditional fraud elements missed',
              impact: 'medium',
              delay: 1000
            },
            {
              type: 'neutral',
              description: 'Investigation will focus primarily on technical aspects',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'investigation-priority',
          isOptimal: false,
          category: 'file_fir'
        }
      ]
    },
    {
      id: 'investigation-priority',
      title: 'Investigation Priority Setting',
      description: 'Set the priority level for this case',
      context: 'The FIR has been filed with appropriate sections. Now you need to set the investigation priority.',
      scenario: 'With the FIR filed, you need to determine the investigation priority. Consider the amount involved (₹50,000), the victim\'s profile (senior citizen), and the current caseload of your team.',
      timeLimit: 90, // 1.5 minutes
      options: [
        {
          id: 'high-priority',
          text: 'Set as High Priority',
          description: 'Immediate investigation with dedicated resources',
          points: 15,
          feedback: 'Correct! Amount above ₹20,000 and senior citizen victim warrant high priority investigation.',
          consequences: [
            {
              type: 'positive',
              description: 'Dedicated investigator assigned within 24 hours',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'positive',
              description: 'Better chances of fund recovery within critical window',
              impact: 'high',
              delay: 2000
            }
          ],
          nextDecisionId: null, // End of tree
          isOptimal: true,
          category: 'escalate'
        },
        {
          id: 'medium-priority',
          text: 'Set as Medium Priority',
          description: 'Standard investigation timeline',
          points: 8,
          feedback: 'Given the amount and victim profile, high priority would be more appropriate for timely resolution.',
          consequences: [
            {
              type: 'neutral',
              description: 'Investigation will proceed with standard timeline',
              impact: 'medium',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'May miss critical window for fund recovery',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: null,
          isOptimal: false,
          category: 'wait'
        },
        {
          id: 'low-priority',
          text: 'Set as Low Priority',
          description: 'Add to regular investigation queue',
          points: 2,
          feedback: 'Low priority is inappropriate for this case. The amount and victim profile require urgent attention.',
          consequences: [
            {
              type: 'negative',
              description: 'Investigation significantly delayed',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Victim satisfaction severely impacted',
              impact: 'high',
              delay: 2000
            }
          ],
          nextDecisionId: null,
          isOptimal: false,
          category: 'wait'
        }
      ]
    },
    {
      id: 'delayed-action-consequences',
      title: 'Consequences of Delay',
      description: 'Handle the consequences of waiting too long',
      context: 'You chose to wait and gather more information. Time has passed and new developments have occurred.',
      scenario: 'Two days have passed since you asked Mrs. Sharma to gather more information. She returns with additional details, but the bank informs that the 72-hour window for transaction reversal has expired. The funds have been withdrawn from the recipient account.',
      options: [
        {
          id: 'file-fir-now',
          text: 'File FIR immediately now',
          description: 'Proceed with FIR filing despite the delay',
          points: 8,
          feedback: 'Better late than never, but the critical window has been missed. This will make fund recovery much more difficult.',
          consequences: [
            {
              type: 'negative',
              description: 'Critical 72-hour window missed for fund recovery',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'neutral',
              description: 'Investigation can still proceed for future prevention',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'cctns-interface-walkthrough',
          isOptimal: false,
          category: 'escalate'
        },
        {
          id: 'continue-ncrp-only',
          text: 'Continue with NCRP registration only',
          description: 'Stick with NCRP portal registration',
          points: 3,
          feedback: 'This approach severely limits investigation capabilities and victim satisfaction.',
          consequences: [
            {
              type: 'negative',
              description: 'Very limited investigation powers',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Victim loses confidence in police response',
              impact: 'high',
              delay: 2000
            }
          ],
          nextDecisionId: null,
          isOptimal: false,
          category: 'wait'
        }
      ]
    },
    {
      id: 'ncrp-limitations',
      title: 'NCRP Registration Limitations',
      description: 'Understanding the limitations of NCRP-only approach',
      context: 'You registered the case on NCRP but did not file an FIR. The victim is asking about next steps.',
      scenario: 'Mrs. Sharma calls after a week asking about the progress. The NCRP registration has been acknowledged, but no concrete investigation steps have been taken. She is frustrated and considering approaching higher authorities.',
      options: [
        {
          id: 'escalate-to-fir-now',
          text: 'Escalate to FIR filing now',
          description: 'Recognize the limitation and file FIR',
          points: 12,
          feedback: 'Good recovery! Recognizing the need for FIR shows learning from the initial decision.',
          consequences: [
            {
              type: 'positive',
              description: 'Investigation powers significantly enhanced',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Some time already lost, but recovery still possible',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'cctns-interface-walkthrough',
          isOptimal: true,
          category: 'escalate'
        },
        {
          id: 'explain-ncrp-process',
          text: 'Explain NCRP process and ask for patience',
          description: 'Try to manage victim expectations',
          points: 4,
          feedback: 'While communication is important, the victim needs concrete action, not just explanations.',
          consequences: [
            {
              type: 'negative',
              description: 'Victim satisfaction continues to decline',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Case may be escalated to senior officers',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: null,
          isOptimal: false,
          category: 'wait'
        }
      ]
    },
    {
      id: 'section-amendment-needed',
      title: 'Section Amendment Required',
      description: 'Handle the need to amend FIR sections',
      context: 'The FIR was filed with insufficient sections. The investigating officer points out the need for amendments.',
      scenario: 'The investigating officer reviews your FIR and points out that IPC 379 alone is insufficient for this cybercrime case. They recommend adding IT Act sections for proper investigation. This will require paperwork and approvals.',
      options: [
        {
          id: 'amend-fir-sections',
          text: 'Amend FIR to add IT Act sections',
          description: 'Add appropriate IT Act sections to the FIR',
          points: 10,
          feedback: 'Correct action to fix the initial error, though it causes some delay in the investigation process.',
          consequences: [
            {
              type: 'positive',
              description: 'FIR now has proper legal framework',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Amendment process causes investigation delay',
              impact: 'medium',
              delay: 2000
            }
          ],
          nextDecisionId: 'investigation-priority',
          isOptimal: true,
          category: 'file_fir'
        },
        {
          id: 'proceed-with-current-sections',
          text: 'Proceed with current sections',
          description: 'Continue investigation with existing sections',
          points: 2,
          feedback: 'This will severely limit the investigation scope and may affect the case outcome.',
          consequences: [
            {
              type: 'negative',
              description: 'Investigation scope remains limited',
              impact: 'high',
              delay: 1000
            },
            {
              type: 'negative',
              description: 'Prosecution may face challenges in court',
              impact: 'high',
              delay: 2000
            }
          ],
          nextDecisionId: null,
          isOptimal: false,
          category: 'wait'
        }
      ]
    }
  ],
  startDecisionId: 'initial-complaint-delay',
  minScore: 0,
  maxScore: 50, // Will be calculated automatically
  metadata: {
    module: 4,
    difficulty: 'intermediate',
    estimatedTime: 15, // minutes
    learningObjectives: [
      'Understand when to escalate complaints to FIR',
      'Learn proper CCTNS interface usage',
      'Recognize appropriate legal sections for cybercrimes',
      'Understand investigation priority setting'
    ]
  }
};

export default module4DecisionTree;