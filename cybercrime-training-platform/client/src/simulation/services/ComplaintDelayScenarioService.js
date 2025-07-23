/**
 * ComplaintDelayScenarioService.js
 * 
 * Service for generating and managing complaint delay scenarios
 * used in Module 4: Escalation to FIR and CCTNS.
 */
import { ComplaintDelayScenario, TimelineEvent, DecisionPoint } from '../models/ComplaintDelayScenario';
import { Scenario, Character, InteractionOption } from '../models/SimulationModels';
import { DecisionOption } from '../models/DecisionTreeModels';
import createComplaintDelayDecisionTree from '../data/complaintDelayDecisions';
import { generateUUID } from '../utils/helpers';

/**
 * Service for generating and managing complaint delay scenarios
 */
class ComplaintDelayScenarioService {
  /**
   * Generate a new complaint delay scenario
   * @param {Object} options - Options for scenario generation
   * @returns {ComplaintDelayScenario} - The generated scenario
   */
  generateScenario(options = {}) {
    // Default options
    const defaultOptions = {
      complexity: 'medium', // 'simple', 'medium', 'complex'
      caseType: 'financial', // 'financial', 'identity', 'harassment'
      timeSpan: 14, // days
      decisionPoints: 3
    };

    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };

    // Generate scenario based on case type
    let scenario;
    switch (mergedOptions.caseType) {
      case 'financial':
        scenario = this.generateFinancialFraudScenario(mergedOptions);
        break;
      case 'identity':
        scenario = this.generateIdentityTheftScenario(mergedOptions);
        break;
      case 'harassment':
        scenario = this.generateCyberHarassmentScenario(mergedOptions);
        break;
      default:
        scenario = this.generateFinancialFraudScenario(mergedOptions);
    }

    return scenario;
  }

  /**
   * Generate a financial fraud scenario
   * @param {Object} options - Options for scenario generation
   * @returns {ComplaintDelayScenario} - The generated scenario
   */
  generateFinancialFraudScenario(options) {
    // Create characters
    const victim = new Character({
      name: 'Rajesh Kumar',
      role: 'Victim',
      description: 'A 45-year-old bank employee who was defrauded of ₹75,000 through an online scam',
      avatarUrl: '/assets/avatars/victim-male-1.png',
      emotionalState: 'anxious',
      traits: ['impatient', 'detail-oriented']
    });

    const officer = new Character({
      name: 'Inspector Sharma',
      role: 'Investigating Officer',
      description: 'Senior cybercrime officer handling the case',
      avatarUrl: '/assets/avatars/officer-male-1.png',
      emotionalState: 'neutral',
      traits: ['professional', 'experienced']
    });

    // Create scenario
    const scenarioData = new Scenario({
      title: 'UPI Fraud Case #CYB-2023-0142',
      description: 'A case of financial fraud where the victim was tricked into making multiple UPI payments',
      context: 'The victim received a call from someone claiming to be from his bank, saying his account would be blocked unless he verified his details through a UPI transaction.',
      characters: [victim, officer]
    });

    // Create timeline events
    const timelineEvents = this.generateFinancialFraudTimelineEvents(options);

    // Create decision points
    const decisionPoints = this.generateFinancialFraudDecisionPoints(timelineEvents, options);

    // Create the complete scenario
    return new ComplaintDelayScenario({
      title: 'UPI Fraud Escalation Scenario',
      description: 'Handle a UPI fraud case that has been delayed in processing',
      scenario: scenarioData,
      timelineEvents,
      decisionPoints,
      startTimelineEventId: timelineEvents[0].id
    });
  }

  /**
   * Generate timeline events for a financial fraud scenario
   * @param {Object} options - Options for scenario generation
   * @returns {Array<TimelineEvent>} - The generated timeline events
   */
  generateFinancialFraudTimelineEvents(options) {
    const now = new Date();
    const events = [];

    // Day 1: Initial complaint
    const initialComplaintDate = new Date(now);
    initialComplaintDate.setDate(now.getDate() - options.timeSpan);
    
    events.push(new TimelineEvent({
      title: 'Initial Complaint Filed',
      description: 'Victim reported fraudulent UPI transactions totaling ₹75,000 to the cybercrime portal',
      timestamp: initialComplaintDate,
      type: 'standard',
      icon: 'file-text'
    }));

    // Day 2: Complaint registered
    const complaintRegisteredDate = new Date(initialComplaintDate);
    complaintRegisteredDate.setDate(initialComplaintDate.getDate() + 1);
    
    events.push(new TimelineEvent({
      title: 'Complaint Registered',
      description: 'Complaint assigned reference number CYB-2023-0142 and routed to local cybercrime cell',
      timestamp: complaintRegisteredDate,
      type: 'standard',
      icon: 'check-circle'
    }));

    // Day 3: Initial investigation
    const initialInvestigationDate = new Date(complaintRegisteredDate);
    initialInvestigationDate.setDate(complaintRegisteredDate.getDate() + 1);
    
    events.push(new TimelineEvent({
      title: 'Initial Investigation',
      description: 'Officer contacted victim for additional details about the fraudulent transactions',
      timestamp: initialInvestigationDate,
      type: 'standard',
      icon: 'search'
    }));

    // Day 5: Bank contacted
    const bankContactedDate = new Date(initialInvestigationDate);
    bankContactedDate.setDate(initialInvestigationDate.getDate() + 2);
    
    events.push(new TimelineEvent({
      title: 'Bank Contacted',
      description: 'Request sent to bank for transaction details and recipient account information',
      timestamp: bankContactedDate,
      type: 'standard',
      icon: 'building'
    }));

    // Day 7: Bank response
    const bankResponseDate = new Date(bankContactedDate);
    bankResponseDate.setDate(bankContactedDate.getDate() + 2);
    
    events.push(new TimelineEvent({
      title: 'Bank Response Received',
      description: 'Bank provided transaction details showing funds transferred to accounts in another state',
      timestamp: bankResponseDate,
      type: 'standard',
      icon: 'mail'
    }));

    // Day 10: No progress
    const noProgressDate = new Date(bankResponseDate);
    noProgressDate.setDate(bankResponseDate.getDate() + 3);
    
    events.push(new TimelineEvent({
      title: 'No Progress Update',
      description: 'Victim called to inquire about case status, no significant progress to report',
      timestamp: noProgressDate,
      type: 'critical',
      icon: 'alert-circle'
    }));

    // Day 12: Victim complaint
    const victimComplaintDate = new Date(noProgressDate);
    victimComplaintDate.setDate(noProgressDate.getDate() + 2);
    
    events.push(new TimelineEvent({
      title: 'Victim Filed Complaint About Delay',
      description: 'Victim submitted formal complaint about lack of progress in the investigation',
      timestamp: victimComplaintDate,
      type: 'critical',
      icon: 'alert-triangle'
    }));

    // Day 14: Decision point
    const decisionDate = new Date(victimComplaintDate);
    decisionDate.setDate(victimComplaintDate.getDate() + 2);
    
    events.push(new TimelineEvent({
      title: 'Case Review Required',
      description: 'Senior officer requested case review due to delay and victim complaint',
      timestamp: decisionDate,
      type: 'decision',
      icon: 'help-circle'
    }));

    return events;
  }

  /**
   * Generate decision points for a financial fraud scenario
   * @param {Array<TimelineEvent>} timelineEvents - The timeline events
   * @param {Object} options - Options for scenario generation
   * @returns {Array<DecisionPoint>} - The generated decision points
   */
  generateFinancialFraudDecisionPoints(timelineEvents, options) {
    const decisionPoints = [];

    // Find the decision event
    const decisionEvent = timelineEvents.find(event => event.type === 'decision');
    
    if (decisionEvent) {
      // Get decision tree data
      const decisionTree = createComplaintDelayDecisionTree();
      
      // Select appropriate decision point based on timespan
      let decisionPointData;
      if (options.timeSpan <= 7) {
        // For short timespan, use decision point 1 (7 days)
        decisionPointData = decisionTree.getDecisionPoint('decision-1');
      } else {
        // For 15+ days, use decision point 2 (15 days)
        decisionPointData = decisionTree.getDecisionPoint('decision-2');
      }
      
      // Convert decision tree options to interaction options
      const interactionOptions = decisionPointData.options.map(option => {
        return new InteractionOption({
          id: option.id,
          text: option.text,
          value: option.category || option.id,
          points: option.points,
          feedback: option.feedback,
          isCorrect: option.isCorrect,
          category: option.category
        });
      });
      
      // Create decision point
      decisionPoints.push(new DecisionPoint({
        title: decisionPointData.title,
        description: decisionPointData.description,
        timelineEventId: decisionEvent.id,
        contextInfo: decisionPointData.context,
        options: interactionOptions
      }));
    }

    return decisionPoints;
  }

  /**
   * Generate an identity theft scenario
   * @param {Object} options - Options for scenario generation
   * @returns {ComplaintDelayScenario} - The generated scenario
   */
  generateIdentityTheftScenario(options) {
    // Implementation similar to financial fraud scenario but with identity theft details
    // This is a placeholder - would be implemented with specific identity theft scenario details
    return this.generateFinancialFraudScenario(options); // Fallback to financial fraud for now
  }

  /**
   * Generate a cyber harassment scenario
   * @param {Object} options - Options for scenario generation
   * @returns {ComplaintDelayScenario} - The generated scenario
   */
  generateCyberHarassmentScenario(options) {
    // Implementation similar to financial fraud scenario but with cyber harassment details
    // This is a placeholder - would be implemented with specific cyber harassment scenario details
    return this.generateFinancialFraudScenario(options); // Fallback to financial fraud for now
  }
}

export default ComplaintDelayScenarioService;