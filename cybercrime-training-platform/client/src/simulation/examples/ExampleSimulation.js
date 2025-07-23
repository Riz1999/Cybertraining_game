/**
 * Example Simulation
 * 
 * This file provides an example simulation that can be used for testing
 * and as a reference for creating new simulations.
 */
import { SIMULATION_TYPES, INTERACTION_TYPES } from '../models/SimulationTypes';

// Example dialog simulation for cybercrime complaint intake
const dialogSimulation = {
  id: 'dialog-simulation-example',
  type: SIMULATION_TYPES.DIALOG,
  title: 'Cybercrime Complaint Intake',
  description: 'Practice handling a cybercrime complaint from a victim.',
  
  scenario: {
    title: 'Online Banking Fraud',
    description: 'A victim has arrived at the police station to report an online banking fraud.',
    context: 'You are a police officer at the cybercrime cell. A distressed victim has arrived to report that money has been fraudulently transferred from their bank account.',
    characters: [
      {
        id: 'victim-1',
        name: 'Rajesh Kumar',
        role: 'Victim',
        description: 'A 45-year-old bank employee who has lost ₹50,000 in an online banking fraud.',
        avatarUrl: '/assets/characters/victim-male-1.png',
        emotionalState: 'distressed'
      }
    ]
  },
  
  interactions: [
    {
      id: 'intro-1',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Rajesh Kumar approaches your desk looking worried. How do you greet him?',
      options: [
        {
          id: 'intro-1-opt-1',
          text: 'Hello sir, how can I help you today?',
          value: 'polite',
          points: 10,
          feedback: 'Good approach. A polite and professional greeting helps put the victim at ease.',
          isCorrect: true,
          nextInteractionId: 'complaint-1'
        },
        {
          id: 'intro-1-opt-2',
          text: 'Yes? What happened?',
          value: 'direct',
          points: 5,
          feedback: 'This approach is direct but could be perceived as abrupt. A more welcoming greeting would be better.',
          isCorrect: false,
          nextInteractionId: 'complaint-1'
        },
        {
          id: 'intro-1-opt-3',
          text: 'Take a seat and fill out this form first.',
          value: 'procedural',
          points: 0,
          feedback: 'This approach is too procedural and lacks empathy. The victim is distressed and needs reassurance first.',
          isCorrect: false,
          nextInteractionId: 'complaint-1'
        }
      ]
    },
    {
      id: 'complaint-1',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'Rajesh: "I received a call yesterday claiming to be from my bank. They said my account had suspicious activity and asked me to verify my details. This morning I found ₹50,000 missing from my account!" What information should you gather first?',
      options: [
        {
          id: 'complaint-1-opt-1',
          text: 'Ask for his bank account details and transaction history',
          value: 'bank_details',
          points: 5,
          feedback: 'While this information is important, it\'s better to first establish the timeline and nature of the fraud.',
          isCorrect: false,
          nextInteractionId: 'categorize-1'
        },
        {
          id: 'complaint-1-opt-2',
          text: 'Ask about the caller - phone number, what they said, how long the call lasted',
          value: 'caller_details',
          points: 10,
          feedback: 'Good choice. Understanding how the scam was executed is crucial for categorization and investigation.',
          isCorrect: true,
          nextInteractionId: 'categorize-1'
        },
        {
          id: 'complaint-1-opt-3',
          text: 'Tell him to contact his bank first before filing a police complaint',
          value: 'redirect',
          points: 0,
          feedback: 'This is incorrect. While contacting the bank is important, you should not turn away a victim. The complaint should be registered immediately, especially since it\'s within 24 hours of the fraud.',
          isCorrect: false,
          nextInteractionId: 'categorize-1'
        }
      ]
    },
    {
      id: 'categorize-1',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'Based on the information provided, how would you categorize this cybercrime?',
      options: [
        {
          id: 'categorize-1-opt-1',
          text: 'Online Banking Fraud',
          value: 'banking_fraud',
          points: 5,
          feedback: 'This is partially correct, but there\'s a more specific category that better describes this crime.',
          isCorrect: false,
          nextInteractionId: 'action-1'
        },
        {
          id: 'categorize-1-opt-2',
          text: 'Phishing/Vishing Scam',
          value: 'phishing',
          points: 10,
          feedback: 'Correct! This is a vishing (voice phishing) scam where the criminal impersonated a bank official over the phone to obtain sensitive information.',
          isCorrect: true,
          nextInteractionId: 'action-1'
        },
        {
          id: 'categorize-1-opt-3',
          text: 'Identity Theft',
          value: 'identity_theft',
          points: 3,
          feedback: 'While elements of identity theft are present, the primary method used was a vishing scam.',
          isCorrect: false,
          nextInteractionId: 'action-1'
        }
      ]
    },
    {
      id: 'action-1',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'What immediate action should you take now?',
      options: [
        {
          id: 'action-1-opt-1',
          text: 'Register an FIR immediately',
          value: 'fir',
          points: 5,
          feedback: 'While an FIR may be needed eventually, the first step should be to try to freeze the transaction if it\'s within 24 hours.',
          isCorrect: false,
          nextInteractionId: 'conclusion-1'
        },
        {
          id: 'action-1-opt-2',
          text: 'Attempt to freeze the transaction through the bank\'s nodal officer',
          value: 'freeze',
          points: 10,
          feedback: 'Correct! Since the fraud occurred within the last 24 hours, there\'s a chance to freeze the transaction and recover the funds.',
          isCorrect: true,
          nextInteractionId: 'conclusion-1'
        },
        {
          id: 'action-1-opt-3',
          text: 'Ask the victim to file a complaint on the NCRP portal',
          value: 'ncrp',
          points: 3,
          feedback: 'While filing on NCRP is important, the immediate action should be to try to freeze the transaction since it\'s within 24 hours.',
          isCorrect: false,
          nextInteractionId: 'conclusion-1'
        }
      ]
    },
    {
      id: 'conclusion-1',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'After taking immediate action, what should you advise Rajesh to do next?',
      options: [
        {
          id: 'conclusion-1-opt-1',
          text: 'Change all his banking passwords and enable two-factor authentication',
          value: 'security',
          points: 10,
          feedback: 'Excellent advice. Securing his accounts is crucial to prevent further fraud.',
          isCorrect: true,
          nextInteractionId: null
        },
        {
          id: 'conclusion-1-opt-2',
          text: 'Wait for the bank to contact him about the investigation',
          value: 'wait',
          points: 0,
          feedback: 'This is not good advice. The victim should take proactive steps to secure his accounts rather than waiting.',
          isCorrect: false,
          nextInteractionId: null
        },
        {
          id: 'conclusion-1-opt-3',
          text: 'Close his current bank account and open a new one',
          value: 'close',
          points: 5,
          feedback: 'While this might be advisable in some cases, changing passwords and enabling two-factor authentication is a more immediate and practical first step.',
          isCorrect: false,
          nextInteractionId: null
        }
      ]
    }
  ],
  
  outcomes: [
    {
      id: 'outcome-excellent',
      condition: 'context.score >= 40',
      feedback: 'Excellent work! You handled the cybercrime complaint professionally and took all the right steps. Your quick action may help recover the victim\'s funds.',
      points: 10
    },
    {
      id: 'outcome-good',
      condition: 'context.score >= 25 && context.score < 40',
      feedback: 'Good job handling the complaint. There are some areas where you could improve, but you took most of the right steps.',
      points: 5
    },
    {
      id: 'outcome-needs-improvement',
      condition: 'context.score < 25',
      feedback: 'You need to improve your handling of cybercrime complaints. Review the proper procedures for intake, categorization, and immediate actions.',
      points: 0
    }
  ],
  
  assets: [
    {
      id: 'victim-avatar',
      type: 'image',
      url: '/assets/characters/victim-male-1.png',
      name: 'Victim Avatar',
      description: 'Avatar image for the victim character'
    }
  ],
  
  startInteractionId: 'intro-1'
};

// Example form simulation for NCRP form filling
const formSimulation = {
  id: 'form-simulation-example',
  type: SIMULATION_TYPES.FORM,
  title: 'NCRP Form Completion',
  description: 'Practice filling out an NCRP complaint form accurately.',
  // ... form simulation details would go here
};

// Example timer simulation for transaction freezing
const timerSimulation = {
  id: 'timer-simulation-example',
  type: SIMULATION_TYPES.TIMER,
  title: 'Emergency Transaction Freezing',
  description: 'Practice the time-critical process of freezing a fraudulent transaction.',
  // ... timer simulation details would go here
};

// Export the example simulations
export default {
  dialogSimulation,
  formSimulation,
  timerSimulation
};