/**
 * Sample decision tree data for the complaint delay scenario
 * 
 * This file contains sample decision points for the Module 4: Escalation to FIR and CCTNS
 * with options to Escalate, Wait, or File FIR based on different case scenarios.
 */
import { DecisionPoint, DecisionOption, DecisionTree } from '../models/DecisionTreeModels';

/**
 * Create a sample decision tree for complaint delay scenarios
 * @returns {DecisionTree} A decision tree with sample decision points
 */
export const createComplaintDelayDecisionTree = () => {
  // Create decision points
  const decisionPoints = [
    // Decision Point 1: Initial complaint review (7 days after filing)
    new DecisionPoint({
      id: 'decision-1',
      title: 'Initial Complaint Review',
      description: 'A cybercrime complaint was filed 7 days ago regarding an online financial fraud of ₹25,000. The victim has provided bank transaction details and screenshots of the fraudulent website. No action has been taken yet.',
      context: 'You are reviewing this case for the first time. The complaint was registered in the NCRP system 7 days ago.',
      scenario: 'The victim has called twice to check on the status. Initial verification confirms this appears to be a legitimate complaint with sufficient evidence. What action will you take?',
      options: [
        new DecisionOption({
          id: 'option-1-1',
          text: 'Wait for more information',
          description: 'Continue gathering evidence and wait for the bank\'s response before taking further action.',
          category: 'wait',
          points: 10,
          feedback: 'This is a reasonable decision at this stage. The complaint is only 7 days old, and you should gather more information from the bank before escalating.',
          isCorrect: true,
          isOptimal: true
        }),
        new DecisionOption({
          id: 'option-1-2',
          text: 'Escalate to FIR immediately',
          description: 'Convert the complaint to an FIR due to the significant amount involved.',
          category: 'escalate',
          points: -5,
          feedback: 'This is premature. The complaint is only 7 days old, and standard procedure recommends escalation after 15 days if there is no resolution. Immediate escalation should be reserved for cases with clear evidence of organized crime or very large amounts.',
          isCorrect: false
        }),
        new DecisionOption({
          id: 'option-1-3',
          text: 'File in CCTNS',
          description: 'Enter the case directly into the CCTNS system as a cybercrime case.',
          category: 'file_fir',
          points: -10,
          feedback: 'This is incorrect. Filing in CCTNS should only happen after an FIR is registered. The complaint is still in the preliminary stage and should be handled through the NCRP system first.',
          isCorrect: false
        })
      ]
    }),
    
    // Decision Point 2: Follow-up review (15 days after filing)
    new DecisionPoint({
      id: 'decision-2',
      title: 'Follow-up Review (15 Days)',
      description: 'The same cybercrime complaint is now 15 days old. The bank has confirmed the transaction was made to a fraudulent account. The victim has provided additional evidence including chat logs with the fraudster.',
      context: 'The 15-day threshold for complaint resolution has been reached. You have confirmation from the bank about the fraudulent nature of the transaction.',
      scenario: 'The victim is increasingly distressed and has called multiple times for updates. The fraudulent account holder has been identified, but no action has been taken yet. What action will you take now?',
      options: [
        new DecisionOption({
          id: 'option-2-1',
          text: 'Wait for more information',
          description: 'Continue the investigation at the complaint level to gather more evidence.',
          category: 'wait',
          points: -10,
          feedback: 'This is not appropriate. The complaint is now 15 days old with clear evidence of fraud and identification of the suspect. According to guidelines, cases should be escalated to FIR if not resolved within 15 days.',
          isCorrect: false
        }),
        new DecisionOption({
          id: 'option-2-2',
          text: 'Escalate to FIR',
          description: 'Convert the complaint to an FIR as the 15-day threshold has been reached and there is clear evidence of fraud.',
          category: 'escalate',
          points: 15,
          feedback: 'This is the correct decision. The complaint has reached the 15-day threshold, there is clear evidence of fraud, and the suspect has been identified. Escalation to FIR is appropriate at this stage.',
          isCorrect: true,
          isOptimal: true
        }),
        new DecisionOption({
          id: 'option-2-3',
          text: 'File in CCTNS without FIR',
          description: 'Enter the case directly into CCTNS to expedite the process.',
          category: 'file_fir',
          points: -5,
          feedback: 'This is procedurally incorrect. While the case should be escalated, you must first register an FIR before filing in CCTNS. Skipping the FIR step violates proper procedure.',
          isCorrect: false
        })
      ]
    })
  ];
  
  // Create the decision tree
  return new DecisionTree({
    title: 'Complaint Delay Scenario',
    description: 'Decision tree for handling delayed cybercrime complaints',
    context: 'You are a cybercrime officer responsible for reviewing complaints and deciding when to escalate them to FIR and file in CCTNS.',
    decisionPoints: decisionPoints,
    startDecisionId: 'decision-1'
  });
};

export default createComplaintDelayDecisionTree;